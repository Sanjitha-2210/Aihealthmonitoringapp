import { VitalsData } from '../types/vitals';

/**
 * Generate sample vitals data for testing
 */
export function generateSampleVitalsHistory(count: number = 10): Omit<VitalsData, 'timestamp' | 'userId'>[] {
  const samples: Omit<VitalsData, 'timestamp' | 'userId'>[] = [];
  
  // Base values with some variation
  const baseAge = 35;
  const baseWeight = 75;
  const baseHeight = 170;
  
  for (let i = 0; i < count; i++) {
    // Create realistic trends over time
    const daysPast = count - i - 1;
    
    // Simulate improving health over time
    const improvementFactor = 1 - (daysPast / count) * 0.15;
    
    samples.push({
      age: baseAge,
      gender: Math.random() > 0.5 ? 'male' : 'female',
      weight: baseWeight + (Math.random() - 0.5) * 2,
      height: baseHeight,
      heartRate: Math.round(75 + (Math.random() - 0.5) * 10 - (daysPast * 0.5)),
      systolicBP: Math.round(130 - (daysPast * 0.8) + (Math.random() - 0.5) * 5),
      diastolicBP: Math.round(85 - (daysPast * 0.5) + (Math.random() - 0.5) * 3),
      bloodSugar: Math.round(120 - (daysPast * 1.2) + (Math.random() - 0.5) * 8),
      steps: Math.round(6000 + (daysPast * 200) + (Math.random() - 0.5) * 1000),
      sleepHours: 6.5 + (daysPast * 0.05) + (Math.random() - 0.5) * 0.5,
    });
  }
  
  return samples;
}

/**
 * Get a single sample vitals entry
 */
export function getSampleVitals(): Omit<VitalsData, 'timestamp' | 'userId'> {
  return {
    age: 35,
    gender: 'male',
    weight: 75,
    height: 170,
    heartRate: 72,
    systolicBP: 120,
    diastolicBP: 80,
    bloodSugar: 95,
    steps: 10000,
    sleepHours: 7.5,
  };
}
