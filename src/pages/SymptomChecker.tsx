import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Search, AlertTriangle } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const SymptomChecker = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    bleeding: '',
    painLevel: '',
    painLocation: [],
    menstrualCycle: '',
    otherSymptoms: [],
    duration: ''
  });

  const handleSymptomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic symptom analysis
    let recommendations = [];
    let urgency = 'low';

    if (formData.painLevel === 'severe' || formData.bleeding === 'heavy') {
      urgency = 'high';
      recommendations.push('Consider seeing a doctor immediately');
    } else if (formData.painLevel === 'moderate' || formData.bleeding === 'moderate') {
      urgency = 'medium';
      recommendations.push('Schedule an appointment with your healthcare provider');
    }

    if (formData.otherSymptoms.includes('irregular-periods') || formData.menstrualCycle === 'irregular') {
      recommendations.push('Track your menstrual cycle and discuss with a gynecologist');
    }

    if (recommendations.length === 0) {
      recommendations.push('Continue monitoring your symptoms and maintain regular check-ups');
    }

    toast({
      title: "Symptom Analysis Complete",
      description: `${recommendations.join('. ')}. Remember, this is not a medical diagnosis.`,
      variant: urgency === 'high' ? 'destructive' : 'default'
    });
  };

  const handlePainLocationChange = (location: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      painLocation: checked 
        ? [...prev.painLocation, location]
        : prev.painLocation.filter(l => l !== location)
    }));
  };

  const handleOtherSymptomsChange = (symptom: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      otherSymptoms: checked 
        ? [...prev.otherSymptoms, symptom]
        : prev.otherSymptoms.filter(s => s !== symptom)
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center space-x-3 max-w-4xl mx-auto">
          <Button variant="ghost" onClick={() => navigate('/home')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
              <Search className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">Symptom Checker</h1>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Check Your Symptoms
          </h2>
          <p className="text-gray-600">
            Answer a few questions to get personalized health insights
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <CardDescription className="text-amber-700">
                This tool provides general guidance only and is not a substitute for professional medical advice
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSymptomSubmit} className="space-y-6">
              {/* Bleeding */}
              <div>
                <Label className="text-base font-semibold">Are you experiencing any unusual bleeding?</Label>
                <RadioGroup value={formData.bleeding} onValueChange={(value) => setFormData(prev => ({...prev, bleeding: value}))}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="none" id="bleeding-none" />
                    <Label htmlFor="bleeding-none">No unusual bleeding</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="bleeding-light" />
                    <Label htmlFor="bleeding-light">Light bleeding between periods</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="moderate" id="bleeding-moderate" />
                    <Label htmlFor="bleeding-moderate">Moderate bleeding</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="heavy" id="bleeding-heavy" />
                    <Label htmlFor="bleeding-heavy">Heavy bleeding</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Pain Level */}
              <div>
                <Label className="text-base font-semibold">What is your current pain level?</Label>
                <RadioGroup value={formData.painLevel} onValueChange={(value) => setFormData(prev => ({...prev, painLevel: value}))}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="none" id="pain-none" />
                    <Label htmlFor="pain-none">No pain</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mild" id="pain-mild" />
                    <Label htmlFor="pain-mild">Mild pain (1-3/10)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="moderate" id="pain-moderate" />
                    <Label htmlFor="pain-moderate">Moderate pain (4-6/10)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="severe" id="pain-severe" />
                    <Label htmlFor="pain-severe">Severe pain (7-10/10)</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Pain Location */}
              <div>
                <Label className="text-base font-semibold mb-3 block">Where is the pain located? (Select all that apply)</Label>
                <div className="space-y-2">
                  {['Lower abdomen', 'Pelvic area', 'Lower back', 'Legs', 'During urination'].map((location) => (
                    <div key={location} className="flex items-center space-x-2">
                      <Checkbox
                        id={location}
                        checked={formData.painLocation.includes(location)}
                        onCheckedChange={(checked) => handlePainLocationChange(location, checked as boolean)}
                      />
                      <Label htmlFor={location}>{location}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Menstrual Cycle */}
              <div>
                <Label className="text-base font-semibold">How would you describe your menstrual cycle?</Label>
                <RadioGroup value={formData.menstrualCycle} onValueChange={(value) => setFormData(prev => ({...prev, menstrualCycle: value}))}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="regular" id="cycle-regular" />
                    <Label htmlFor="cycle-regular">Regular (21-35 days)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="irregular" id="cycle-irregular" />
                    <Label htmlFor="cycle-irregular">Irregular</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="absent" id="cycle-absent" />
                    <Label htmlFor="cycle-absent">Absent</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Other Symptoms */}
              <div>
                <Label className="text-base font-semibold mb-3 block">Any other symptoms? (Select all that apply)</Label>
                <div className="space-y-2">
                  {[
                    'Irregular periods',
                    'Excessive hair growth',
                    'Weight gain',
                    'Acne',
                    'Fatigue',
                    'Bloating',
                    'Breast tenderness',
                    'Mood changes'
                  ].map((symptom) => (
                    <div key={symptom} className="flex items-center space-x-2">
                      <Checkbox
                        id={symptom}
                        checked={formData.otherSymptoms.includes(symptom)}
                        onCheckedChange={(checked) => handleOtherSymptomsChange(symptom, checked as boolean)}
                      />
                      <Label htmlFor={symptom}>{symptom}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div>
                <Label htmlFor="duration" className="text-base font-semibold">How long have you been experiencing these symptoms?</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({...prev, duration: e.target.value}))}
                  placeholder="e.g., 2 weeks, 1 month, 6 months"
                  className="mt-2"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
              >
                Analyze Symptoms
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SymptomChecker;
