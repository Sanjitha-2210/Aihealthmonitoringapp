import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { VitalsData } from '../types/vitals';
import { calculateBMI } from '../utils/predictions';
import { Heart, Activity, Droplet, Scale, Footprints, Moon, User, Ruler } from 'lucide-react';

interface VitalsSummaryCardsProps {
  vitals: VitalsData;
}

export function VitalsSummaryCards({ vitals }: VitalsSummaryCardsProps) {
  const bmi = calculateBMI(vitals.weight, vitals.height);
  
  const cards = [
    {
      title: 'Heart Rate',
      value: `${vitals.heartRate}`,
      unit: 'bpm',
      icon: Heart,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Blood Pressure',
      value: `${vitals.systolicBP}/${vitals.diastolicBP}`,
      unit: 'mmHg',
      icon: Activity,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Blood Sugar',
      value: `${vitals.bloodSugar}`,
      unit: 'mg/dL',
      icon: Droplet,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'BMI',
      value: bmi.toFixed(1),
      unit: 'kg/m²',
      icon: Scale,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Daily Steps',
      value: vitals.steps.toLocaleString(),
      unit: 'steps',
      icon: Footprints,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Sleep',
      value: vitals.sleepHours.toFixed(1),
      unit: 'hours',
      icon: Moon,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50',
    },
    {
      title: 'Weight',
      value: vitals.weight.toFixed(1),
      unit: 'kg',
      icon: Scale,
      color: 'text-pink-500',
      bgColor: 'bg-pink-50',
    },
    {
      title: 'Height',
      value: `${vitals.height}`,
      unit: 'cm',
      icon: Ruler,
      color: 'text-teal-500',
      bgColor: 'bg-teal-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <Card key={index} className={`${card.bgColor} border-none`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <card.icon className={`w-4 h-4 ${card.color}`} />
              {card.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${card.color}`}>
              {card.value}
            </div>
            <div className="text-xs text-gray-500 mt-1">{card.unit}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
