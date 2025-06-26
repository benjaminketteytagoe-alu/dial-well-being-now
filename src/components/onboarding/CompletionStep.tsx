
import React from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle, Smartphone, Users, BookOpen } from "lucide-react";

interface CompletionStepProps {
  userData: {
    name: string;
  };
  prevStep: () => void;
  isLast: boolean;
}

const CompletionStep: React.FC<CompletionStepProps> = ({
  userData,
  prevStep,
  isLast
}) => {
  const handleComplete = () => {
    // Here you would typically save the user data and navigate to the main app
    console.log('User onboarding completed:', userData);
    // For now, we'll just show an alert
    alert('Welcome to NauriCare! Your profile has been set up successfully.');
  };

  const features = [
    {
      icon: Smartphone,
      title: 'Symptom Checker',
      description: 'AI-powered health assessment tool'
    },
    {
      icon: BookOpen,
      title: 'Health Education',
      description: 'Learn about women\'s health topics'
    },
    {
      icon: Users,
      title: 'Community Support',
      description: 'Connect with other women'
    }
  ];

  return (
    <div className="space-y-6 text-center">
      <div className="space-y-4">
        <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-800">
          Welcome aboard, {userData.name}!
        </h3>
        
        <p className="text-gray-600">
          Your profile is all set up. Here's what you can explore next:
        </p>
      </div>

      <div className="space-y-3">
        {features.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
              <div className="p-2 bg-white rounded-lg">
                <IconComponent className="w-5 h-5 text-orange-600" />
              </div>
              <div className="text-left">
                <h4 className="font-medium text-gray-800">{feature.title}</h4>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex space-x-3">
        <Button variant="outline" onClick={prevStep} className="flex-1">
          Back
        </Button>
        <Button 
          onClick={handleComplete}
          className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default CompletionStep;
