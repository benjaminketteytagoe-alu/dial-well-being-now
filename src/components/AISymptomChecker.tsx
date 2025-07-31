import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Brain, 
  Stethoscope, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight,
  Loader2,
  Star,
  MapPin,
  Phone
} from "lucide-react";
import { AISymptomChecker, SymptomData, AIAnalysisResult, ReferralRecommendation } from '@/services/aiService';
import { useToast } from '@/hooks/use-toast';

interface SymptomCheckerProps {
  onComplete?: (analysis: AIAnalysisResult, referrals: ReferralRecommendation[]) => void;
}

const AISymptomCheckerComponent: React.FC<SymptomCheckerProps> = ({ onComplete }) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [referrals, setReferrals] = useState<ReferralRecommendation[]>([]);
  
  const [formData, setFormData] = useState<SymptomData>({
    symptoms: [],
    age: 25,
    medicalHistory: [],
    currentMedications: [],
    familyHistory: [],
    lifestyleFactors: [],
    severity: 5,
    duration: '1-3 months'
  });

  const symptomOptions = {
    pcos: [
      "Irregular periods",
      "Heavy or light bleeding",
      "Weight gain",
      "Acne",
      "Excessive hair growth",
      "Hair loss",
      "Dark patches on skin",
      "Difficulty losing weight"
    ],
    fibroids: [
      "Heavy menstrual bleeding",
      "Pelvic pain or pressure",
      "Frequent urination",
      "Constipation",
      "Back pain",
      "Leg pain",
      "Pain during intercourse",
      "Enlarged abdomen"
    ],
    maternal: [
      "Pregnancy-related symptoms",
      "Fertility concerns",
      "Morning sickness",
      "Fatigue",
      "Mood changes",
      "Breast tenderness",
      "Food cravings",
      "Frequent urination"
    ]
  };

  const medicalHistoryOptions = [
    "Diabetes",
    "Hypertension",
    "Thyroid disorders",
    "Previous surgeries",
    "Allergies",
    "Mental health conditions",
    "None"
  ];

  const lifestyleOptions = [
    "Sedentary lifestyle",
    "High stress levels",
    "Poor diet",
    "Smoking",
    "Alcohol consumption",
    "Regular exercise",
    "Balanced diet",
    "Adequate sleep"
  ];

  const steps = [
    { title: "Basic Information", description: "Age and duration" },
    { title: "Symptoms", description: "Select your symptoms" },
    { title: "Medical History", description: "Past conditions and medications" },
    { title: "Lifestyle", description: "Daily habits and factors" },
    { title: "Analysis", description: "AI-powered assessment" }
  ];

  const handleSymptomToggle = (symptom: string) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }));
  };

  const handleMultiSelect = (item: string, field: keyof SymptomData) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).includes(item)
        ? (prev[field] as string[]).filter(i => i !== item)
        : [...(prev[field] as string[]), item]
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 2) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === steps.length - 2) {
      analyzeSymptoms();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const analyzeSymptoms = async () => {
    setLoading(true);
    try {
      const result = await AISymptomChecker.analyzeSymptoms(formData);
      const referralResults = AISymptomChecker.getReferralRecommendations(result);
      
      setAnalysis(result);
      setReferrals(referralResults);
      setCurrentStep(steps.length - 1);
      
      onComplete?.(result, referralResults);
      
      toast({
        title: "Analysis Complete",
        description: "Your symptom analysis has been completed successfully.",
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Error",
        description: "Failed to analyze symptoms. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'immediate': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'soon': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'routine': return <Calendar className="w-4 h-4 text-green-500" />;
      default: return <Calendar className="w-4 h-4 text-gray-500" />;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) || 25 }))}
                min="13"
                max="100"
              />
            </div>
            <div>
              <Label htmlFor="duration">How long have you been experiencing symptoms?</Label>
              <Select value={formData.duration} onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="less than 1 month">Less than 1 month</SelectItem>
                  <SelectItem value="1-3 months">1-3 months</SelectItem>
                  <SelectItem value="3-6 months">3-6 months</SelectItem>
                  <SelectItem value="6-12 months">6-12 months</SelectItem>
                  <SelectItem value="more than 1 year">More than 1 year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">PCOS Symptoms</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {symptomOptions.pcos.map((symptom) => (
                  <div key={symptom} className="flex items-center space-x-2">
                    <Checkbox
                      id={symptom}
                      checked={formData.symptoms.includes(symptom)}
                      onCheckedChange={() => handleSymptomToggle(symptom)}
                    />
                    <Label htmlFor={symptom}>{symptom}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Fibroid Symptoms</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {symptomOptions.fibroids.map((symptom) => (
                  <div key={symptom} className="flex items-center space-x-2">
                    <Checkbox
                      id={symptom}
                      checked={formData.symptoms.includes(symptom)}
                      onCheckedChange={() => handleSymptomToggle(symptom)}
                    />
                    <Label htmlFor={symptom}>{symptom}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Maternal Health Symptoms</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {symptomOptions.maternal.map((symptom) => (
                  <div key={symptom} className="flex items-center space-x-2">
                    <Checkbox
                      id={symptom}
                      checked={formData.symptoms.includes(symptom)}
                      onCheckedChange={() => handleSymptomToggle(symptom)}
                    />
                    <Label htmlFor={symptom}>{symptom}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Severity Level (1-10)</Label>
              <div className="px-4">
                <Slider
                  value={[formData.severity]}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, severity: value[0] }))}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>1 - Mild</span>
                  <span className="font-medium">Current: {formData.severity}</span>
                  <span>10 - Severe</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Medical History</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {medicalHistoryOptions.map((condition) => (
                  <div key={condition} className="flex items-center space-x-2">
                    <Checkbox
                      id={condition}
                      checked={formData.medicalHistory.includes(condition)}
                      onCheckedChange={() => handleMultiSelect(condition, 'medicalHistory')}
                    />
                    <Label htmlFor={condition}>{condition}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Label htmlFor="medications">Current Medications (optional)</Label>
              <Textarea
                id="medications"
                placeholder="List any medications you're currently taking..."
                value={formData.currentMedications.join(', ')}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  currentMedications: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                }))}
              />
            </div>
            
            <div>
              <Label htmlFor="familyHistory">Family History (optional)</Label>
              <Textarea
                id="familyHistory"
                placeholder="Any relevant family medical history..."
                value={formData.familyHistory.join(', ')}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  familyHistory: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                }))}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Lifestyle Factors</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {lifestyleOptions.map((factor) => (
                  <div key={factor} className="flex items-center space-x-2">
                    <Checkbox
                      id={factor}
                      checked={formData.lifestyleFactors.includes(factor)}
                      onCheckedChange={() => handleMultiSelect(factor, 'lifestyleFactors')}
                    />
                    <Label htmlFor={factor}>{factor}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            {analysis && (
              <>
                <Alert>
                  <Brain className="h-4 w-4" />
                  <AlertDescription>
                    AI-powered analysis completed. This is for informational purposes only and should not replace professional medical advice.
                  </AlertDescription>
                </Alert>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Stethoscope className="w-5 h-5" />
                        {analysis.condition}
                      </CardTitle>
                      <Badge className={getRiskLevelColor(analysis.riskLevel)}>
                        {analysis.riskLevel.toUpperCase()} RISK
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      {getUrgencyIcon(analysis.urgency)}
                      <span>Confidence: {(analysis.confidence * 100).toFixed(0)}%</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Analysis</h4>
                      <p className="text-gray-700">{analysis.explanation}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Recommendations</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {analysis.recommendations.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Next Steps</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {analysis.nextSteps.map((step, index) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {referrals.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Recommended Specialists
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {referrals.map((referral, index) => (
                          <div key={index} className="border rounded-lg p-4 space-y-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold">{referral.doctorName}</h4>
                                <p className="text-sm text-gray-600">{referral.specialty}</p>
                                <p className="text-sm text-gray-600">{referral.hospitalName}</p>
                                <p className="text-sm text-gray-600 flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {referral.location}
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                  <span className="font-semibold">{referral.rating}</span>
                                </div>
                                <p className="text-sm text-gray-600">{referral.availability}</p>
                              </div>
                            </div>
                            <p className="text-sm text-gray-700">{referral.reason}</p>
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="w-4 h-4" />
                              <span>{referral.contactInfo}</span>
                            </div>
                            <Button className="w-full" size="sm">
                              Book Appointment
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
          <Brain className="w-8 h-8 text-blue-600" />
          AI Symptom Checker
        </h2>
        <p className="text-gray-600">
          Get personalized insights for PCOS, fibroids, and maternal health
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Step {currentStep + 1} of {steps.length}</span>
          <span className="text-sm text-gray-500">{steps[currentStep]?.title}</span>
        </div>
        <Progress value={((currentStep + 1) / steps.length) * 100} className="h-2" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep]?.title}</CardTitle>
          <CardDescription>{steps[currentStep]?.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
          
          {currentStep < steps.length - 1 && (
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0}
              >
                Back
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing...
                  </>
                ) : currentStep === steps.length - 2 ? (
                  <>
                    Analyze Symptoms
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AISymptomCheckerComponent; 