// Type definitions for health vitals
export interface VitalsData {
  age: number;
  gender: 'male' | 'female' | 'other';
  weight: number; // kg
  height: number; // cm
  heartRate: number; // bpm
  systolicBP: number; // mmHg
  diastolicBP: number; // mmHg
  bloodSugar: number; // mg/dL
  steps: number;
  sleepHours: number;
  timestamp?: string;
  userId?: string;
}

export interface VitalsPrediction {
  predictedSystolicBP: number;
  predictedDiastolicBP: number;
  predictedBloodSugar: number;
  confidence: number;
}

export type RiskLevel = 'low' | 'medium' | 'high';

export interface RiskAnalysis {
  overallRisk: RiskLevel;
  bpRisk: RiskLevel;
  sugarRisk: RiskLevel;
  heartRateRisk: RiskLevel;
  bmiRisk: RiskLevel;
  risks: string[];
  recommendations: string[];
}
