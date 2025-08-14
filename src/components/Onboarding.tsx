
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import WelcomeStep from "./onboarding/WelcomeStep";
import PersonalInfoStep from "./onboarding/PersonalInfoStep";
import HealthPreferencesStep from "./onboarding/HealthPreferencesStep";
import NotificationStep from "./onboarding/NotificationStep";
import CompletionStep from "./onboarding/CompletionStep";

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState({
    name: '',
    age: '',
    location: '',
    healthConcerns: [],
    preferredLanguage: 'English',
    notifications: {
      health_tips: true,
      appointment_reminders: true,
      symptom_tracking: false
    }
  });

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateUserData = (data: Partial<typeof userData>) => {
    setUserData(prev => ({ ...prev, ...data }));
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <WelcomeStep
            nextStep={nextStep}
            isFirst={true}
          />
        );
      case 1:
        return (
          <PersonalInfoStep
            userData={userData}
            updateUserData={updateUserData}
            nextStep={nextStep}
            prevStep={prevStep}
            isFirst={false}
          />
        );
      case 2:
        return (
          <HealthPreferencesStep
            userData={userData}
            updateUserData={updateUserData}
            nextStep={nextStep}
            prevStep={prevStep}
            isFirst={false}
          />
        );
      case 3:
        return (
          <NotificationStep
            userData={userData}
            updateUserData={updateUserData}
            nextStep={nextStep}
            prevStep={prevStep}
            isFirst={false}
          />
        );
      case 4:
        return (
          <CompletionStep
            userData={userData}
            prevStep={prevStep}
            isLast={true}
          />
        );
      default:
        return null;
    }
  };

  const steps = [
    "Welcome to NauriCare",
    "Personal Information", 
    "Health Preferences",
    "Notifications",
    "All Set!"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index <= currentStep
                      ? 'bg-gradient-to-r from-orange-500 to-red-500'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            {steps[currentStep]}
          </CardTitle>
          <CardDescription>
            Step {currentStep + 1} of {steps.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderCurrentStep()}
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;
