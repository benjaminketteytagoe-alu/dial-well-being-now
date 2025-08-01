import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Activity, Clock, Stethoscope } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from '@/contexts/LanguageContext';

interface AnalysisResult {
  riskAssessment: 'Low' | 'Moderate' | 'High' | 'Unable to assess';
  potentialConditions: string[];
  recommendedSpecializations: string[];
  urgency: 'Routine' | 'Soon' | 'Urgent';
  keyFindings: string[];
  recommendations: string[];
  disclaimer: string;
}

const AISymptomChecker: React.FC = () => {
  const [symptoms, setSymptoms] = useState('');
  const [age, setAge] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [currentMedications, setCurrentMedications] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleAnalyze = async () => {
    if (!symptoms.trim()) {
      toast({
        title: "Error",
        description: "Please describe your symptoms",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      console.log('Starting symptom analysis...');
      
      const { data, error } = await supabase.functions.invoke('ai-symptom-analysis', {
        body: {
          symptoms: symptoms.trim(),
          age: age.trim(),
          medicalHistory: medicalHistory.trim(),
          currentMedications: currentMedications.trim(),
        },
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message);
      }

      console.log('Analysis result:', data);
      setAnalysisResult(data);

      toast({
        title: "Analysis Complete",
        description: "Your symptoms have been analyzed successfully",
      });

    } catch (error) {
      console.error('Error analyzing symptoms:', error);
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze symptoms. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      case 'Moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Routine': return 'bg-blue-100 text-blue-800';
      case 'Soon': return 'bg-orange-100 text-orange-800';
      case 'Urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-brand-dark">AI Symptom Checker</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Advanced AI analysis for PCOS, fibroids, and maternal health concerns
        </p>
      </div>

      <Card className="border-brand-accent/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-brand-primary" />
            Symptom Analysis
          </CardTitle>
          <CardDescription>
            Describe your symptoms in detail. Our AI will analyze them for potential PCOS, fibroids, or maternal health concerns.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="symptoms">Describe Your Symptoms *</Label>
            <Textarea
              id="symptoms"
              placeholder="Please describe your symptoms, including when they started, frequency, severity, and any patterns you've noticed..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="min-h-[120px]"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="Your age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="medicalHistory">Medical History</Label>
              <Input
                id="medicalHistory"
                placeholder="Any relevant conditions"
                value={medicalHistory}
                onChange={(e) => setMedicalHistory(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="medications">Current Medications</Label>
              <Input
                id="medications"
                placeholder="Current medications"
                value={currentMedications}
                onChange={(e) => setCurrentMedications(e.target.value)}
              />
            </div>
          </div>

          <Button 
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full bg-brand-primary hover:bg-brand-secondary text-white"
          >
            {isAnalyzing ? (
              <>
                <Activity className="h-4 w-4 mr-2 animate-spin" />
                Analyzing Symptoms...
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4 mr-2" />
                Analyze Symptoms
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {analysisResult && (
        <Card className="border-brand-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-brand-primary" />
              Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Risk Assessment</Label>
                <Badge 
                  variant="outline" 
                  className={`text-sm font-medium ${getRiskColor(analysisResult.riskAssessment)}`}
                >
                  {analysisResult.riskAssessment} Risk
                </Badge>
              </div>
              <div className="space-y-2">
                <Label>Urgency Level</Label>
                <Badge 
                  variant="outline" 
                  className={`text-sm font-medium ${getUrgencyColor(analysisResult.urgency)}`}
                >
                  <Clock className="h-3 w-3 mr-1" />
                  {analysisResult.urgency}
                </Badge>
              </div>
            </div>

            {analysisResult.potentialConditions.length > 0 && (
              <div className="space-y-2">
                <Label>Potential Conditions to Discuss</Label>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.potentialConditions.map((condition, index) => (
                    <Badge key={index} variant="secondary">
                      {condition}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {analysisResult.recommendedSpecializations.length > 0 && (
              <div className="space-y-2">
                <Label>Recommended Specialists</Label>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.recommendedSpecializations.map((spec, index) => (
                    <Badge key={index} className="bg-brand-light text-brand-dark">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {analysisResult.keyFindings.length > 0 && (
              <div className="space-y-2">
                <Label>Key Findings</Label>
                <ul className="space-y-1">
                  {analysisResult.keyFindings.map((finding, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-brand-primary mt-1">•</span>
                      {finding}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {analysisResult.recommendations.length > 0 && (
              <div className="space-y-2">
                <Label>Recommendations</Label>
                <ul className="space-y-1">
                  {analysisResult.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-brand-primary mt-1">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-yellow-800">Important Disclaimer</p>
                  <p className="text-sm text-yellow-700">
                    {analysisResult.disclaimer || "This analysis is for informational purposes only and does not constitute medical advice. Please consult with qualified healthcare professionals for proper diagnosis and treatment."}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AISymptomChecker;