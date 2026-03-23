import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { VitalsData } from '../types/vitals';
import { Heart, Activity, Droplet, Moon, Footprints } from 'lucide-react';

interface VitalsInputFormProps {
  onSubmit: (vitals: VitalsData) => void;
  isLoading?: boolean;
  initialValues?: Partial<VitalsData>;
}

export function VitalsInputForm({ onSubmit, isLoading = false, initialValues }: VitalsInputFormProps) {
  const [formData, setFormData] = useState<Partial<VitalsData>>({
    age: initialValues?.age || 30,
    gender: initialValues?.gender || 'male',
    weight: initialValues?.weight || 70,
    height: initialValues?.height || 170,
    heartRate: initialValues?.heartRate || 75,
    systolicBP: initialValues?.systolicBP || 120,
    diastolicBP: initialValues?.diastolicBP || 80,
    bloodSugar: initialValues?.bloodSugar || 100,
    steps: initialValues?.steps || 8000,
    sleepHours: initialValues?.sleepHours || 7,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields are filled
    if (
      formData.age && formData.gender && formData.weight && formData.height &&
      formData.heartRate && formData.systolicBP && formData.diastolicBP &&
      formData.bloodSugar !== undefined && formData.steps !== undefined && formData.sleepHours
    ) {
      onSubmit(formData as VitalsData);
    }
  };

  const updateField = (field: keyof VitalsData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          Record Your Vitals
        </CardTitle>
        <CardDescription>
          Enter your current health measurements
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                min="1"
                max="120"
                value={formData.age}
                onChange={(e) => updateField('age', parseInt(e.target.value))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => updateField('gender', value)}
              >
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                min="20"
                max="300"
                step="0.1"
                value={formData.weight}
                onChange={(e) => updateField('weight', parseFloat(e.target.value))}
                required
              />
            </div>
          </div>

          {/* Body Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                min="50"
                max="250"
                value={formData.height}
                onChange={(e) => updateField('height', parseInt(e.target.value))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heartRate" className="flex items-center gap-1">
                <Heart className="w-4 h-4 text-red-500" />
                Heart Rate (bpm)
              </Label>
              <Input
                id="heartRate"
                type="number"
                min="40"
                max="200"
                value={formData.heartRate}
                onChange={(e) => updateField('heartRate', parseInt(e.target.value))}
                required
              />
            </div>
          </div>

          {/* Blood Pressure */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              <Activity className="w-4 h-4 text-blue-500" />
              Blood Pressure (mmHg)
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="systolicBP" className="text-sm text-gray-600">
                  Systolic (upper)
                </Label>
                <Input
                  id="systolicBP"
                  type="number"
                  min="70"
                  max="250"
                  value={formData.systolicBP}
                  onChange={(e) => updateField('systolicBP', parseInt(e.target.value))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="diastolicBP" className="text-sm text-gray-600">
                  Diastolic (lower)
                </Label>
                <Input
                  id="diastolicBP"
                  type="number"
                  min="40"
                  max="150"
                  value={formData.diastolicBP}
                  onChange={(e) => updateField('diastolicBP', parseInt(e.target.value))}
                  required
                />
              </div>
            </div>
          </div>

          {/* Blood Sugar */}
          <div className="space-y-2">
            <Label htmlFor="bloodSugar" className="flex items-center gap-1">
              <Droplet className="w-4 h-4 text-purple-500" />
              Blood Sugar Level (mg/dL)
            </Label>
            <Input
              id="bloodSugar"
              type="number"
              min="50"
              max="400"
              value={formData.bloodSugar}
              onChange={(e) => updateField('bloodSugar', parseInt(e.target.value))}
              required
            />
          </div>

          {/* Lifestyle Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="steps" className="flex items-center gap-1">
                <Footprints className="w-4 h-4 text-green-500" />
                Daily Steps
              </Label>
              <Input
                id="steps"
                type="number"
                min="0"
                max="50000"
                value={formData.steps}
                onChange={(e) => updateField('steps', parseInt(e.target.value))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sleepHours" className="flex items-center gap-1">
                <Moon className="w-4 h-4 text-indigo-500" />
                Sleep Hours
              </Label>
              <Input
                id="sleepHours"
                type="number"
                min="0"
                max="24"
                step="0.5"
                value={formData.sleepHours}
                onChange={(e) => updateField('sleepHours', parseFloat(e.target.value))}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Vitals'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
