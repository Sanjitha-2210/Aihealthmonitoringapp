import React, { useState, useEffect } from 'react';
import { VitalsData } from '../types/vitals';
import { analyzeRisks } from '../utils/predictions';
import { generateSampleVitalsHistory } from '../utils/sampleData';
import { VitalsInputForm } from './VitalsInputForm';
import { VitalsSummaryCards } from './VitalsSummaryCards';
import { VitalsCharts } from './VitalsCharts';
import { RiskAnalysisCard } from './RiskAnalysisCard';
import { PredictionCard } from './PredictionCard';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { LogOut, Download, TrendingUp, Activity, BarChart3, AlertCircle, Database } from 'lucide-react';
import { getSupabaseClient } from '../utils/supabase';
import { toast } from 'sonner';

interface DashboardProps {
  accessToken: string;
  user: any;
  onLogout: () => void;
}

export function Dashboard({ accessToken, user, onLogout }: DashboardProps) {
  const [vitalsHistory, setVitalsHistory] = useState<VitalsData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const supabase = getSupabaseClient();

  // Fetch vitals history on mount
  useEffect(() => {
    fetchVitalsHistory();
  }, []);

  const fetchVitalsHistory = async () => {
    setIsFetching(true);
    try {
      console.log('Fetching vitals history for user:', user.id);
      
      // Query the KV store table directly for all vitals entries for this user
      const { data, error } = await supabase
        .from('kv_store_8a2b1ce1')
        .select('key, value')
        .like('key', `vitals:${user.id}:%`)
        .order('key', { ascending: false });

      if (error) {
        console.error('Error fetching vitals:', error);
        toast.error(`Failed to load vitals: ${error.message}`);
        return;
      }

      // Extract and parse vitals data
      const vitals: VitalsData[] = data?.map(item => item.value as VitalsData) || [];
      
      // Sort by timestamp (most recent first)
      vitals.sort((a, b) => {
        const timeA = new Date(a.timestamp || 0).getTime();
        const timeB = new Date(b.timestamp || 0).getTime();
        return timeB - timeA;
      });

      setVitalsHistory(vitals);
      console.log('Loaded vitals:', vitals.length);
    } catch (error) {
      console.error('Error fetching vitals:', error);
      toast.error('Failed to load vitals history');
    } finally {
      setIsFetching(false);
    }
  };

  const handleSaveVitals = async (vitals: VitalsData) => {
    setIsLoading(true);
    try {
      // Add timestamp and userId
      const timestamp = new Date().toISOString();
      const vitalsWithMeta: VitalsData = {
        ...vitals,
        timestamp,
        userId: user.id
      };

      // Create a unique key for this vitals entry
      const key = `vitals:${user.id}:${timestamp}`;

      // Save to KV store
      const { error } = await supabase
        .from('kv_store_8a2b1ce1')
        .upsert({
          key,
          value: vitalsWithMeta
        });

      if (error) {
        console.error('Failed to save vitals:', error);
        toast.error(`Failed to save vitals: ${error.message}`);
        return;
      }

      toast.success('Vitals saved successfully!');
      await fetchVitalsHistory();
    } catch (error) {
      console.error('Error saving vitals:', error);
      toast.error('Failed to save vitals');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  const handleExportCSV = () => {
    if (vitalsHistory.length === 0) {
      toast.error('No data to export');
      return;
    }

    // Create CSV content
    const headers = [
      'Timestamp', 'Age', 'Gender', 'Weight (kg)', 'Height (cm)',
      'Heart Rate (bpm)', 'Systolic BP', 'Diastolic BP',
      'Blood Sugar (mg/dL)', 'Steps', 'Sleep Hours'
    ];

    const rows = vitalsHistory.map(v => [
      v.timestamp || '',
      v.age,
      v.gender,
      v.weight,
      v.height,
      v.heartRate,
      v.systolicBP,
      v.diastolicBP,
      v.bloodSugar,
      v.steps,
      v.sleepHours
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `health-vitals-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success('Data exported successfully!');
  };

  const handleAddSampleData = async () => {
    setIsLoading(true);
    const sampleData = generateSampleVitalsHistory(10);
    
    try {
      // Prepare all sample entries
      const entries = sampleData.map((sample, index) => {
        // Create timestamps spread over the last 10 days
        const timestamp = new Date();
        timestamp.setDate(timestamp.getDate() - (9 - index));
        const timestampStr = timestamp.toISOString();
        
        const vitalsWithMeta: VitalsData = {
          ...sample,
          timestamp: timestampStr,
          userId: user.id
        };

        return {
          key: `vitals:${user.id}:${timestampStr}`,
          value: vitalsWithMeta
        };
      });

      // Batch insert all sample data
      const { error } = await supabase
        .from('kv_store_8a2b1ce1')
        .upsert(entries);

      if (error) {
        console.error('Failed to save sample vitals:', error);
        toast.error(`Failed to add sample data: ${error.message}`);
        return;
      }
      
      toast.success('Sample data added successfully!');
      await fetchVitalsHistory();
    } catch (error) {
      console.error('Error adding sample data:', error);
      toast.error('Failed to add sample data');
    } finally {
      setIsLoading(false);
    }
  };

  const latestVitals = vitalsHistory[0];
  const riskAnalysis = latestVitals ? analyzeRisks(latestVitals) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                AI Health Monitor
              </h1>
              <p className="text-sm text-gray-600">
                Welcome, {user?.user_metadata?.name || user?.email}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              disabled={vitalsHistory.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview">
              <TrendingUp className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="input">
              <Activity className="w-4 h-4 mr-2" />
              Add Vitals
            </TabsTrigger>
            <TabsTrigger value="charts">
              <BarChart3 className="w-4 h-4 mr-2" />
              Trends
            </TabsTrigger>
            <TabsTrigger value="analysis">
              <AlertCircle className="w-4 h-4 mr-2" />
              Risk Analysis
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {isFetching ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading your health data...</p>
              </div>
            ) : latestVitals ? (
              <>
                <VitalsSummaryCards vitals={latestVitals} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <PredictionCard vitalsHistory={vitalsHistory} />
                  {riskAnalysis && <RiskAnalysisCard riskAnalysis={riskAnalysis} />}
                </div>
              </>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
                <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No vitals recorded yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Start tracking your health by adding your first vitals entry
                </p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={() => document.querySelector('[value="input"]')?.dispatchEvent(new Event('click'))}>
                    Add Your First Entry
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleAddSampleData}
                    disabled={isLoading}
                  >
                    <Database className="w-4 h-4 mr-2" />
                    {isLoading ? 'Adding...' : 'Add Sample Data'}
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Input Tab */}
          <TabsContent value="input">
            <VitalsInputForm
              onSubmit={handleSaveVitals}
              isLoading={isLoading}
              initialValues={latestVitals}
            />
          </TabsContent>

          {/* Charts Tab */}
          <TabsContent value="charts">
            <VitalsCharts vitalsHistory={vitalsHistory} />
          </TabsContent>

          {/* Analysis Tab */}
          <TabsContent value="analysis">
            {latestVitals && riskAnalysis ? (
              <RiskAnalysisCard riskAnalysis={riskAnalysis} />
            ) : (
              <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
                <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No analysis available
                </h3>
                <p className="text-gray-600">
                  Add vitals to see risk analysis and recommendations
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}