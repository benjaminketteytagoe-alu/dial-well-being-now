
import React from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface HealthPreferencesStepProps {
  userData: {
    healthConcerns: string[];
  };
  updateUserData: (data: any) => void;
  nextStep: () => void;
  prevStep: () => void;
  isFirst: boolean;
}

const HealthPreferencesStep: React.FC<HealthPreferencesStepProps> = ({
  userData,
  updateUserData,
  nextStep,
  prevStep,
  isFirst
}) => {
  const healthOptions = [
    { id: 'fibroids', label: 'Fibroids', description: 'Non-cancerous growths in the uterus' },
    { id: 'pcos', label: 'PCOS', description: 'Polycystic Ovary Syndrome' },
    { id: 'menstrual', label: 'Menstrual Health', description: 'Period tracking and concerns' },
    { id: 'fertility', label: 'Fertility', description: 'Family planning and conception' },
    { id: 'pregnancy', label: 'Pregnancy', description: 'Prenatal and maternal health' },
    { id: 'menopause', label: 'Menopause', description: 'Hormonal changes and symptoms' },
    { id: 'general', label: 'General Wellness', description: 'Overall health and prevention' }
  ];

  const handleConcernChange = (concernId: string, checked: boolean) => {
    const updatedConcerns = checked
      ? [...userData.healthConcerns, concernId]
      : userData.healthConcerns.filter(c => c !== concernId);
    
    updateUserData({ healthConcerns: updatedConcerns });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-gray-800 mb-2">
          What health topics interest you?
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Select all that apply to personalize your experience
        </p>
      </div>

      <div className="space-y-3">
        {healthOptions.map((option) => (
          <div key={option.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
            <Checkbox
              id={option.id}
              checked={userData.healthConcerns.includes(option.id)}
              onCheckedChange={(checked) => handleConcernChange(option.id, checked as boolean)}
              className="mt-1"
            />
            <div className="flex-1">
              <Label htmlFor={option.id} className="font-medium cursor-pointer">
                {option.label}
              </Label>
              <p className="text-sm text-gray-600 mt-1">{option.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex space-x-3">
        <Button variant="outline" onClick={prevStep} className="flex-1">
          Back
        </Button>
        <Button 
          onClick={nextStep}
          className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default HealthPreferencesStep;
