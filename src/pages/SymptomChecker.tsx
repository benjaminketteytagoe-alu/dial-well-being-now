// @ts-nocheck
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SymptomChecker from '@/components/SymptomChecker';
import AISymptomChecker from '@/components/AISymptomChecker';
import ReferralEngine from '@/components/ReferralEngine';
import { useLanguage } from '@/contexts/LanguageContext';
import { AIAnalysisResult, ReferralRecommendation } from '@/types';

const SymptomCheckerPage = () => {
  const [activeTab, setActiveTab] = useState('symptom-checker');
  const [, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [, setReferralResults] = useState<ReferralRecommendation[]>([]);

  const handleAnalysisComplete = (analysis: AIAnalysisResult, referrals: ReferralRecommendation[]) => {
    setAnalysisResult(analysis);
    setReferralResults(referrals);
    setActiveTab('referrals');
  };

  const handleReferralSelect = (referral: ReferralRecommendation) => {
    console.log('Selected referral:', referral);
    setActiveTab('booking');
  };

  const handleBookingComplete = (_booking: any) => {
    console.log('Booking submitted:', _booking);
    setActiveTab('confirmation');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">AI-Powered Symptom Analysis</h1>
          <p className="text-gray-600">Get intelligent health insights and doctor recommendations</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="symptom-checker">Symptoms</TabsTrigger>
            <TabsTrigger value="ai-analysis">AI Analysis</TabsTrigger>
            <TabsTrigger value="referrals">Referrals</TabsTrigger>
            <TabsTrigger value="booking">Booking</TabsTrigger>
          </TabsList>

          <TabsContent value="symptom-checker">
            <SymptomChecker onAnalysisComplete={handleAnalysisComplete} />
          </TabsContent>

          <TabsContent value="ai-analysis">
            <AISymptomChecker />
          </TabsContent>

          <TabsContent value="referrals">
            <ReferralEngine onReferralSelect={handleReferralSelect} />
          </TabsContent>

          <TabsContent value="booking">
            <Card>
              <CardHeader>
                <CardTitle>Book Consultation</CardTitle>
                <CardDescription>
                  Complete your booking with the recommended specialist
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">Booking functionality integrated with doctor availability</p>
                  <Button onClick={() => handleBookingComplete({})}>
                    Complete Booking
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SymptomCheckerPage;