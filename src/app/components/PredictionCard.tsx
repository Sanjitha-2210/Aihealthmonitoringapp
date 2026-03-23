import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { VitalsData, VitalsPrediction } from '../types/vitals';
import { predictFutureVitals } from '../utils/predictions';
import { TrendingUp, Zap, Activity, Droplet, Footprints, Moon } from 'lucide-react';
import { Badge } from './ui/badge';

interface PredictionCardProps {
  vitalsHistory: VitalsData[];
}

export function PredictionCard({ vitalsHistory }: PredictionCardProps) {
  const latestVitals = vitalsHistory[0];
  
  // What-if simulation state
  const [whatIfSteps, setWhatIfSteps] = useState(latestVitals?.steps || 8000);
  const [whatIfSleep, setWhatIfSleep] = useState(latestVitals?.sleepHours || 7);
  
  // Update sliders when new data comes in
  useEffect(() => {
    if (latestVitals) {
      setWhatIfSteps(latestVitals.steps);
      setWhatIfSleep(latestVitals.sleepHours);
    }
  }, [latestVitals]);

  if (!latestVitals) {
    return null;
  }

  // Get baseline prediction
  const baselinePrediction = predictFutureVitals(vitalsHistory);
  
  // Get what-if prediction
  const whatIfPrediction = predictFutureVitals(
    vitalsHistory,
    whatIfSteps,
    whatIfSleep
  );

  const stepsDiff = whatIfSteps - latestVitals.steps;
  const sleepDiff = whatIfSleep - latestVitals.sleepHours;
  
  const bpImprovement = baselinePrediction.predictedSystolicBP - whatIfPrediction.predictedSystolicBP;
  const sugarImprovement = baselinePrediction.predictedBloodSugar - whatIfPrediction.predictedBloodSugar;

  return (
    <div className="space-y-4">
      {/* AI Predictions */}
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            AI Health Predictions
          </CardTitle>
          <CardDescription>
            Based on your historical data and trends
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Predicted Blood Pressure */}
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-gray-600">Blood Pressure</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {whatIfPrediction.predictedSystolicBP}/{whatIfPrediction.predictedDiastolicBP}
              </div>
              <div className="text-xs text-gray-500 mt-1">mmHg (predicted)</div>
            </div>

            {/* Predicted Blood Sugar */}
            <div className="bg-white p-4 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Droplet className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium text-gray-600">Blood Sugar</span>
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {whatIfPrediction.predictedBloodSugar}
              </div>
              <div className="text-xs text-gray-500 mt-1">mg/dL (predicted)</div>
            </div>

            {/* Confidence */}
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-gray-600">Confidence</span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {Math.round(whatIfPrediction.confidence * 100)}%
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {vitalsHistory.length} data point{vitalsHistory.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>

          {vitalsHistory.length < 3 && (
            <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
              💡 Add more entries to improve prediction accuracy
            </div>
          )}
        </CardContent>
      </Card>

      {/* What-If Simulation */}
      <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-green-600" />
            What-If Simulation
          </CardTitle>
          <CardDescription>
            Adjust lifestyle factors to see potential health improvements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Steps Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Footprints className="w-4 h-4 text-green-500" />
                Daily Steps
              </Label>
              <Badge variant="outline" className="font-mono">
                {whatIfSteps.toLocaleString()}
              </Badge>
            </div>
            <Slider
              value={[whatIfSteps]}
              onValueChange={(value) => setWhatIfSteps(value[0])}
              min={0}
              max={25000}
              step={500}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0</span>
              <span>25,000</span>
            </div>
            {stepsDiff !== 0 && (
              <div className={`text-sm ${stepsDiff > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stepsDiff > 0 ? '+' : ''}{stepsDiff.toLocaleString()} steps from current
              </div>
            )}
          </div>

          {/* Sleep Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-indigo-500" />
                Sleep Hours
              </Label>
              <Badge variant="outline" className="font-mono">
                {whatIfSleep.toFixed(1)} hrs
              </Badge>
            </div>
            <Slider
              value={[whatIfSleep]}
              onValueChange={(value) => setWhatIfSleep(value[0])}
              min={0}
              max={12}
              step={0.5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0 hrs</span>
              <span>12 hrs</span>
            </div>
            {sleepDiff !== 0 && (
              <div className={`text-sm ${sleepDiff > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {sleepDiff > 0 ? '+' : ''}{sleepDiff.toFixed(1)} hours from current
              </div>
            )}
          </div>

          {/* Impact Analysis */}
          {(stepsDiff !== 0 || sleepDiff !== 0) && (
            <div className="mt-6 p-4 bg-white rounded-lg border-2 border-green-200">
              <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Projected Impact
              </h4>
              <div className="space-y-2 text-sm">
                {bpImprovement !== 0 && (
                  <div className={bpImprovement > 0 ? 'text-green-700' : 'text-red-700'}>
                    Blood Pressure: {bpImprovement > 0 ? '↓' : '↑'} {Math.abs(Math.round(bpImprovement))} mmHg
                    {bpImprovement > 0 && ' (Improvement!)'}
                  </div>
                )}
                {sugarImprovement !== 0 && (
                  <div className={sugarImprovement > 0 ? 'text-green-700' : 'text-red-700'}>
                    Blood Sugar: {sugarImprovement > 0 ? '↓' : '↑'} {Math.abs(Math.round(sugarImprovement))} mg/dL
                    {sugarImprovement > 0 && ' (Improvement!)'}
                  </div>
                )}
                {bpImprovement > 0 || sugarImprovement > 0 ? (
                  <div className="mt-3 pt-3 border-t border-green-200 text-green-800 font-medium">
                    ✓ These lifestyle changes could improve your health!
                  </div>
                ) : (
                  <div className="mt-3 pt-3 border-t border-red-200 text-red-800 font-medium">
                    ⚠ Current adjustments may worsen health metrics
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
