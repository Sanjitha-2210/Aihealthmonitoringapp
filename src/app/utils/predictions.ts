// AI Prediction and Risk Analysis Logic
import { VitalsData, VitalsPrediction, RiskAnalysis, RiskLevel } from '../types/vitals';

/**
 * Simple linear regression prediction based on historical data
 * Uses trend analysis to predict future values
 */
export function predictFutureVitals(
  history: VitalsData[],
  whatIfSteps?: number,
  whatIfSleep?: number
): VitalsPrediction {
  if (history.length === 0) {
    return {
      predictedSystolicBP: 120,
      predictedDiastolicBP: 80,
      predictedBloodSugar: 100,
      confidence: 0
    };
  }

  // Get the most recent data point
  const latest = history[0];
  
  if (history.length === 1) {
    // No historical trend, return current values
    return {
      predictedSystolicBP: latest.systolicBP,
      predictedDiastolicBP: latest.diastolicBP,
      predictedBloodSugar: latest.bloodSugar,
      confidence: 0.5
    };
  }

  // Calculate trends using simple linear regression
  const systolicTrend = calculateTrend(history.map(v => v.systolicBP));
  const diastolicTrend = calculateTrend(history.map(v => v.diastolicBP));
  const sugarTrend = calculateTrend(history.map(v => v.bloodSugar));
  
  // Base prediction on trend
  let predictedSystolic = latest.systolicBP + systolicTrend;
  let predictedDiastolic = latest.diastolicBP + diastolicTrend;
  let predictedSugar = latest.bloodSugar + sugarTrend;

  // Apply what-if adjustments
  if (whatIfSteps !== undefined) {
    const stepsDiff = whatIfSteps - latest.steps;
    // More steps = lower BP and sugar
    const stepsImpact = (stepsDiff / 10000) * -2; // -2 points per 10k steps
    predictedSystolic += stepsImpact;
    predictedDiastolic += stepsImpact * 0.7;
    predictedSugar += stepsImpact * 3;
  }

  if (whatIfSleep !== undefined) {
    const sleepDiff = whatIfSleep - latest.sleepHours;
    // Better sleep = lower BP and sugar
    const sleepImpact = sleepDiff * -1.5; // -1.5 points per hour of sleep
    predictedSystolic += sleepImpact;
    predictedDiastolic += sleepImpact * 0.7;
    predictedSugar += sleepImpact * 2;
  }

  // Calculate confidence based on data consistency
  const confidence = Math.min(0.9, 0.3 + (history.length * 0.1));

  return {
    predictedSystolicBP: Math.round(Math.max(90, Math.min(200, predictedSystolic))),
    predictedDiastolicBP: Math.round(Math.max(60, Math.min(130, predictedDiastolic))),
    predictedBloodSugar: Math.round(Math.max(70, Math.min(300, predictedSugar))),
    confidence
  };
}

/**
 * Calculate simple linear trend (slope)
 */
function calculateTrend(values: number[]): number {
  if (values.length < 2) return 0;
  
  const n = Math.min(values.length, 10); // Use last 10 data points
  const recentValues = values.slice(0, n);
  
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;
  
  for (let i = 0; i < n; i++) {
    const x = i;
    const y = recentValues[n - 1 - i]; // Reverse order (oldest to newest)
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumX2 += x * x;
  }
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  
  return isNaN(slope) ? 0 : slope;
}

/**
 * Analyze health risks based on vitals
 */
export function analyzeRisks(vitals: VitalsData): RiskAnalysis {
  const risks: string[] = [];
  const recommendations: string[] = [];
  
  // Calculate BMI
  const heightM = vitals.height / 100;
  const bmi = vitals.weight / (heightM * heightM);
  
  // Blood Pressure Risk Analysis
  let bpRisk: RiskLevel = 'low';
  if (vitals.systolicBP >= 140 || vitals.diastolicBP >= 90) {
    bpRisk = 'high';
    risks.push('High blood pressure detected (Hypertension)');
    recommendations.push('Reduce salt intake to less than 2300mg per day');
    recommendations.push('Exercise for at least 30 minutes daily');
    recommendations.push('Avoid processed foods and caffeine');
    recommendations.push('Consult a healthcare provider');
  } else if (vitals.systolicBP >= 130 || vitals.diastolicBP >= 85) {
    bpRisk = 'medium';
    risks.push('Elevated blood pressure (Pre-hypertension)');
    recommendations.push('Monitor blood pressure regularly');
    recommendations.push('Increase physical activity');
    recommendations.push('Reduce sodium in diet');
  }
  
  // Blood Sugar Risk Analysis
  let sugarRisk: RiskLevel = 'low';
  if (vitals.bloodSugar >= 180) {
    sugarRisk = 'high';
    risks.push('High blood sugar level (Hyperglycemia)');
    recommendations.push('Reduce sugar and refined carbohydrate intake');
    recommendations.push('Walk for 15-20 minutes after meals');
    recommendations.push('Increase fiber-rich foods in diet');
    recommendations.push('Check for diabetes - consult a doctor');
  } else if (vitals.bloodSugar >= 140) {
    sugarRisk = 'medium';
    risks.push('Elevated blood sugar (Pre-diabetic range)');
    recommendations.push('Limit sugary drinks and desserts');
    recommendations.push('Increase whole grains and vegetables');
    recommendations.push('Monitor blood sugar levels');
  } else if (vitals.bloodSugar < 70) {
    sugarRisk = 'medium';
    risks.push('Low blood sugar (Hypoglycemia)');
    recommendations.push('Eat regular, balanced meals');
    recommendations.push('Avoid skipping meals');
  }
  
  // Heart Rate Risk Analysis
  let heartRateRisk: RiskLevel = 'low';
  if (vitals.heartRate > 100) {
    heartRateRisk = 'high';
    risks.push('Elevated resting heart rate (Tachycardia)');
    recommendations.push('Practice relaxation techniques (meditation, deep breathing)');
    recommendations.push('Reduce caffeine and stimulants');
    recommendations.push('Ensure adequate hydration');
  } else if (vitals.heartRate < 60 && vitals.heartRate > 40) {
    heartRateRisk = 'medium';
    risks.push('Low resting heart rate (Bradycardia) - may be normal for athletes');
  } else if (vitals.heartRate <= 40) {
    heartRateRisk = 'high';
    risks.push('Very low heart rate - consult a doctor');
  }
  
  // BMI Risk Analysis
  let bmiRisk: RiskLevel = 'low';
  if (bmi >= 30) {
    bmiRisk = 'high';
    risks.push(`Obesity detected (BMI: ${bmi.toFixed(1)})`);
    recommendations.push('Create a calorie deficit through diet and exercise');
    recommendations.push('Aim for 150 minutes of moderate activity per week');
    recommendations.push('Consider consulting a nutritionist');
  } else if (bmi >= 25) {
    bmiRisk = 'medium';
    risks.push(`Overweight (BMI: ${bmi.toFixed(1)})`);
    recommendations.push('Maintain a balanced diet');
    recommendations.push('Increase daily physical activity');
  } else if (bmi < 18.5) {
    bmiRisk = 'medium';
    risks.push(`Underweight (BMI: ${bmi.toFixed(1)})`);
    recommendations.push('Ensure adequate calorie intake');
    recommendations.push('Include protein-rich foods');
  }
  
  // Sleep Analysis
  if (vitals.sleepHours < 6) {
    risks.push('Insufficient sleep (less than 6 hours)');
    recommendations.push('Aim for 7-9 hours of sleep per night');
    recommendations.push('Maintain a consistent sleep schedule');
    recommendations.push('Avoid screens 1 hour before bedtime');
  }
  
  // Physical Activity Analysis
  if (vitals.steps < 5000) {
    risks.push('Low physical activity (less than 5000 steps)');
    recommendations.push('Aim for at least 10,000 steps per day');
    recommendations.push('Take short walking breaks throughout the day');
    recommendations.push('Use stairs instead of elevators');
  }
  
  // Determine overall risk
  const riskLevels = [bpRisk, sugarRisk, heartRateRisk, bmiRisk];
  const highRisks = riskLevels.filter(r => r === 'high').length;
  const mediumRisks = riskLevels.filter(r => r === 'medium').length;
  
  let overallRisk: RiskLevel = 'low';
  if (highRisks >= 2 || (highRisks >= 1 && mediumRisks >= 2)) {
    overallRisk = 'high';
  } else if (highRisks >= 1 || mediumRisks >= 2) {
    overallRisk = 'medium';
  }
  
  // Add general healthy recommendations if no risks
  if (risks.length === 0) {
    recommendations.push('Maintain your healthy lifestyle!');
    recommendations.push('Continue regular exercise and balanced diet');
    recommendations.push('Stay hydrated with 8 glasses of water daily');
    recommendations.push('Get regular health check-ups');
  }
  
  return {
    overallRisk,
    bpRisk,
    sugarRisk,
    heartRateRisk,
    bmiRisk,
    risks,
    recommendations
  };
}

/**
 * Calculate BMI
 */
export function calculateBMI(weight: number, height: number): number {
  const heightM = height / 100;
  return weight / (heightM * heightM);
}

/**
 * Get risk color for UI
 */
export function getRiskColor(risk: RiskLevel): string {
  switch (risk) {
    case 'low':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'medium':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'high':
      return 'text-red-600 bg-red-50 border-red-200';
  }
}

/**
 * Get risk badge color
 */
export function getRiskBadgeColor(risk: RiskLevel): string {
  switch (risk) {
    case 'low':
      return 'bg-green-500';
    case 'medium':
      return 'bg-yellow-500';
    case 'high':
      return 'bg-red-500';
  }
}
