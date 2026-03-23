import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { VitalsData } from '../types/vitals';
import { Activity, Heart, Droplet } from 'lucide-react';
import { format } from 'date-fns';

interface VitalsChartsProps {
  vitalsHistory: VitalsData[];
}

export function VitalsCharts({ vitalsHistory }: VitalsChartsProps) {
  if (vitalsHistory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Health Trends</CardTitle>
          <CardDescription>No data available yet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            Record your vitals to see trend charts
          </div>
        </CardContent>
      </Card>
    );
  }

  // Prepare data for charts (reverse to show chronologically)
  const chartData = [...vitalsHistory]
    .reverse()
    .map((vitals, index) => ({
      index: index + 1,
      date: vitals.timestamp ? format(new Date(vitals.timestamp), 'MMM dd HH:mm') : `Entry ${index + 1}`,
      heartRate: vitals.heartRate,
      systolicBP: vitals.systolicBP,
      diastolicBP: vitals.diastolicBP,
      bloodSugar: vitals.bloodSugar,
    }));

  return (
    <div className="space-y-6">
      {/* Heart Rate Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            Heart Rate Trend
          </CardTitle>
          <CardDescription>
            Resting heart rate over time (bpm)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                domain={[40, 120]}
                tick={{ fontSize: 12 }}
              />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="heartRate" 
                stroke="#ef4444" 
                strokeWidth={2}
                name="Heart Rate"
                dot={{ fill: '#ef4444', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Blood Pressure Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            Blood Pressure Trend
          </CardTitle>
          <CardDescription>
            Systolic and diastolic pressure over time (mmHg)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                domain={[60, 160]}
                tick={{ fontSize: 12 }}
              />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="systolicBP" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Systolic BP"
                dot={{ fill: '#3b82f6', r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="diastolicBP" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                name="Diastolic BP"
                dot={{ fill: '#8b5cf6', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Blood Sugar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplet className="w-5 h-5 text-purple-500" />
            Blood Sugar Trend
          </CardTitle>
          <CardDescription>
            Blood glucose levels over time (mg/dL)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                domain={[70, 200]}
                tick={{ fontSize: 12 }}
              />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="bloodSugar" 
                stroke="#a855f7" 
                strokeWidth={2}
                name="Blood Sugar"
                dot={{ fill: '#a855f7', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
