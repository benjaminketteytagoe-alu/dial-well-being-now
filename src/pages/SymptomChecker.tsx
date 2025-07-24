
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, AlertTriangle } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const SymptomChecker = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    abdominalPain: '',
    irregularPeriods: '',
    discomfortRating: [5],
    email: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.abdominalPain || !formData.irregularPeriods || !formData.email) {
      toast({
        title: "Incomplete Form",
        description: "Please answer all questions and provide your email.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const formElement = e.target as HTMLFormElement;
      const formDataToSubmit = new FormData(formElement);
      
      const response = await fetch('https://formsubmit.co/ajax/your-email@example.com', {
        method: 'POST',
        body: formDataToSubmit
      });

      if (response.ok) {
        toast({
          title: "Symptoms Submitted",
          description: "Your symptom check has been submitted successfully.",
        });

        // Reset form
        setFormData({
          abdominalPain: '',
          irregularPeriods: '',
          discomfortRating: [5],
          email: ''
        });
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error('Error submitting symptoms:', error);
      toast({
        title: "Submission Error",
        description: "Failed to submit your symptoms. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
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
            <div className="flex items-center space-x-2">
              <img  
                className="h-8 w-auto"
                src="../../public/logo1b.png"
                alt="logo"
              />
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
            Answer a few questions to help track your health
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
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Hidden FormSubmit fields */}
              <input type="hidden" name="_next" value={window.location.origin + '/home'} />
              <input type="hidden" name="_subject" value="New Symptom Check Submission" />
              <input type="hidden" name="_captcha" value="false" />
              
              {/* Email */}
              <div>
                <Label htmlFor="email" className="text-base font-semibold mb-3 block">
                  Your Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                  placeholder="Enter your email address"
                  required
                />
              </div>

              {/* Abdominal Pain */}
              <div>
                <Label className="text-base font-semibold mb-3 block">
                  Are you experiencing abdominal pain?
                </Label>
                <RadioGroup 
                  value={formData.abdominalPain} 
                  onValueChange={(value) => setFormData(prev => ({...prev, abdominalPain: value}))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="pain-yes" />
                    <Label htmlFor="pain-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="pain-no" />
                    <Label htmlFor="pain-no">No</Label>
                  </div>
                </RadioGroup>
                <input type="hidden" name="abdominal_pain" value={formData.abdominalPain} />
              </div>

              {/* Irregular Periods */}
              <div>
                <Label className="text-base font-semibold mb-3 block">
                  Are your periods irregular?
                </Label>
                <RadioGroup 
                  value={formData.irregularPeriods} 
                  onValueChange={(value) => setFormData(prev => ({...prev, irregularPeriods: value}))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="irregular-yes" />
                    <Label htmlFor="irregular-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="irregular-no" />
                    <Label htmlFor="irregular-no">No</Label>
                  </div>
                </RadioGroup>
                <input type="hidden" name="irregular_periods" value={formData.irregularPeriods} />
              </div>

              {/* Discomfort Rating */}
              <div>
                <Label className="text-base font-semibold mb-3 block">
                  Rate your discomfort (1-10)
                </Label>
                <div className="px-4">
                  <Slider
                    value={formData.discomfortRating}
                    onValueChange={(value) => setFormData(prev => ({...prev, discomfortRating: value}))}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span>1 - Minimal</span>
                    <span className="font-medium">Current: {formData.discomfortRating[0]}</span>
                    <span>10 - Severe</span>
                  </div>
                </div>
                <input type="hidden" name="discomfort_rating" value={formData.discomfortRating[0]} />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Symptoms'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SymptomChecker;
