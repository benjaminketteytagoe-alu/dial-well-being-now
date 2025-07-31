
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Brain, Navigation, Stethoscope, Users, BookOpen } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import AISymptomCheckerComponent from '@/components/AISymptomChecker';
import ReferralEngine from '@/components/ReferralEngine';
import { AIAnalysisResult, ReferralRecommendation } from '@/services/aiService';

const SymptomChecker = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('symptom-checker');
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [referralResults, setReferralResults] = useState<ReferralRecommendation[]>([]);

  const handleAnalysisComplete = (analysis: AIAnalysisResult, referrals: ReferralRecommendation[]) => {
    setAnalysisResult(analysis);
    setReferralResults(referrals);
    setActiveTab('referrals');
    
    toast({
      title: "Analysis Complete",
      description: `Analysis suggests: ${analysis.condition}`,
    });
  };

  const handleBookingComplete = (booking: any) => {
    toast({
      title: "Booking Submitted",
      description: "Your appointment request has been submitted successfully.",
    });
    
    // Here you would typically save the booking to your database
    console.log('Booking submitted:', booking);
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
                src="https://i.ibb.co/whR2z9DX/logo1b.png"
                alt="logo"
              />
            </div>
            <h1 className="text-xl font-bold text-gray-800">Health Assessment</h1>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            AI-Powered Health Assessment
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get personalized insights for PCOS, fibroids, and maternal health conditions. 
            Our AI analyzes your symptoms and connects you with specialized healthcare providers.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="symptom-checker" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Symptom Checker
            </TabsTrigger>
            <TabsTrigger value="referrals" className="flex items-center gap-2">
              <Navigation className="w-4 h-4" />
              Find Specialists
            </TabsTrigger>
          </TabsList>

          <TabsContent value="symptom-checker" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="w-5 h-5" />
                  AI Symptom Analysis
                </CardTitle>
                <CardDescription>
                  Complete a comprehensive assessment to get personalized health insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AISymptomCheckerComponent onComplete={handleAnalysisComplete} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="referrals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Specialist Referrals
                </CardTitle>
                <CardDescription>
                  Find and book appointments with specialized healthcare providers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ReferralEngine 
                  initialCondition={analysisResult?.condition}
                  onBookingComplete={handleBookingComplete}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab('symptom-checker')}>
              <CardContent className="p-6 text-center">
                <Brain className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                <h4 className="font-semibold mb-2">Start Symptom Check</h4>
                <p className="text-sm text-gray-600">Begin your health assessment</p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab('referrals')}>
              <CardContent className="p-6 text-center">
                <Navigation className="w-8 h-8 mx-auto mb-3 text-green-600" />
                <h4 className="font-semibold mb-2">Find Specialists</h4>
                <p className="text-sm text-gray-600">Browse healthcare providers</p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/dashboard')}>
              <CardContent className="p-6 text-center">
                <BookOpen className="w-8 h-8 mx-auto mb-3 text-purple-600" />
                <h4 className="font-semibold mb-2">View History</h4>
                <p className="text-sm text-gray-600">Check your health records</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Information Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">About Our AI Assessment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600">
                Our AI-powered symptom checker analyzes your symptoms using advanced machine learning 
                algorithms trained on medical data for PCOS, fibroids, and maternal health conditions.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Comprehensive symptom analysis</li>
                <li>• Personalized health insights</li>
                <li>• Risk level assessment</li>
                <li>• Actionable recommendations</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Important Disclaimer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600">
                This AI assessment tool is for informational purposes only and should not replace 
                professional medical advice, diagnosis, or treatment.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Always consult healthcare professionals</li>
                <li>• Not a substitute for medical diagnosis</li>
                <li>• Results may vary</li>
                <li>• Emergency symptoms require immediate care</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SymptomChecker;
