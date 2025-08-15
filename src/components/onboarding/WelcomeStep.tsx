
import React from 'react';
import { Button } from "@/components/ui/button";
import { Heart, Shield, Users } from "lucide-react";

interface WelcomeStepProps {
  nextStep: () => void;
  isFirst: boolean;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ nextStep }) => {
  return (
    <div className="space-y-6 text-center">
      <div className="space-y-4">
        <div className="mx-auto flex justify-center">
          <img
            src="https://i.ibb.co/WN38dKLh/Nauri-Care-Color-B.png"
            alt="Welcome illustration"
            className="w-32 h-32 object-contain"
          />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-800">
          Welcome to Your Health Journey
        </h3>
        
        <p className="text-gray-600">
          NauriCare empowers women with AI-powered health insights, 
          educational resources, and community support.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
          <Shield className="w-6 h-6 text-orange-600" />
          <span className="text-sm text-gray-700">Secure & Private</span>
        </div>
        
        <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
          <Users className="w-6 h-6 text-red-600" />
          <span className="text-sm text-gray-700">Community Support</span>
        </div>
        
        <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg">
          <Heart className="w-6 h-6 text-amber-600" />
          <span className="text-sm text-gray-700">Personalized Care</span>
        </div>
      </div>

      <Button 
        onClick={nextStep}
        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
      >
        Get Started
      </Button>
    </div>
  );
};

export default WelcomeStep;
