import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Badge } from './ui/badge';
import { RiskAnalysis, RiskLevel } from '../types/vitals';
import { getRiskColor, getRiskBadgeColor } from '../utils/predictions';
import { AlertTriangle, CheckCircle, AlertCircle, Activity, Heart, Droplet, Scale } from 'lucide-react';

interface RiskAnalysisCardProps {
  riskAnalysis: RiskAnalysis;
}

export function RiskAnalysisCard({ riskAnalysis }: RiskAnalysisCardProps) {
  const getRiskIcon = (risk: RiskLevel) => {
    switch (risk) {
      case 'low':
        return <CheckCircle className="w-5 h-5" />;
      case 'medium':
        return <AlertCircle className="w-5 h-5" />;
      case 'high':
        return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const getRiskText = (risk: RiskLevel) => {
    switch (risk) {
      case 'low':
        return 'Low Risk';
      case 'medium':
        return 'Medium Risk';
      case 'high':
        return 'High Risk';
    }
  };

  return (
    <div className="space-y-4">
      {/* Overall Risk Alert */}
      <Alert className={getRiskColor(riskAnalysis.overallRisk) + ' border-2'}>
        <div className="flex items-center gap-2">
          {getRiskIcon(riskAnalysis.overallRisk)}
          <AlertTitle className="mb-0 text-lg font-bold">
            Overall Health Status: {getRiskText(riskAnalysis.overallRisk)}
          </AlertTitle>
        </div>
        {riskAnalysis.risks.length > 0 && (
          <AlertDescription className="mt-2">
            {riskAnalysis.risks.length} health concern(s) detected
          </AlertDescription>
        )}
      </Alert>

      {/* Detailed Risk Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Breakdown</CardTitle>
          <CardDescription>
            Detailed analysis of health metrics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Blood Pressure Risk */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-blue-500" />
              <span className="font-medium">Blood Pressure</span>
            </div>
            <Badge className={getRiskBadgeColor(riskAnalysis.bpRisk) + ' text-white'}>
              {getRiskText(riskAnalysis.bpRisk)}
            </Badge>
          </div>

          {/* Blood Sugar Risk */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Droplet className="w-5 h-5 text-purple-500" />
              <span className="font-medium">Blood Sugar</span>
            </div>
            <Badge className={getRiskBadgeColor(riskAnalysis.sugarRisk) + ' text-white'}>
              {getRiskText(riskAnalysis.sugarRisk)}
            </Badge>
          </div>

          {/* Heart Rate Risk */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-red-500" />
              <span className="font-medium">Heart Rate</span>
            </div>
            <Badge className={getRiskBadgeColor(riskAnalysis.heartRateRisk) + ' text-white'}>
              {getRiskText(riskAnalysis.heartRateRisk)}
            </Badge>
          </div>

          {/* BMI Risk */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Scale className="w-5 h-5 text-orange-500" />
              <span className="font-medium">BMI</span>
            </div>
            <Badge className={getRiskBadgeColor(riskAnalysis.bmiRisk) + ' text-white'}>
              {getRiskText(riskAnalysis.bmiRisk)}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Health Concerns */}
      {riskAnalysis.risks.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Health Concerns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {riskAnalysis.risks.map((risk, index) => (
                <li key={index} className="flex items-start gap-2 text-red-800">
                  <span className="text-red-600 mt-1">•</span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-800 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Health Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {riskAnalysis.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start gap-2 text-green-800">
                <span className="text-green-600 mt-1">✓</span>
                <span>{recommendation}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
