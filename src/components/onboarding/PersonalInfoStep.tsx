
// @ts-nocheck
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PersonalInfoStepProps {
  userData: {
    name: string;
    age: string;
    location: string;
    preferredLanguage: string;
  };
  updateUserData: (data: any) => void;
  nextStep: () => void;
  prevStep: () => void;
  isFirst: boolean;
}

const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({
  userData,
  updateUserData,
  nextStep,
  prevStep,
  isFirst
}) => {
  const handleNext = () => {
    if (userData.name && userData.age) {
      nextStep();
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={userData.name}
            onChange={(e) => updateUserData({ name: e.target.value })}
            placeholder="Enter your full name"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="age">Age *</Label>
          <Input
            id="age"
            type="number"
            value={userData.age}
            onChange={(e) => updateUserData({ age: e.target.value })}
            placeholder="Enter your age"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="location">Location (Optional)</Label>
          <Input
            id="location"
            value={userData.location}
            onChange={(e) => updateUserData({ location: e.target.value })}
            placeholder="City, Country"
            className="mt-1"
          />
        </div>

        <div>
          <Label>Preferred Language</Label>
          <Select
            value={userData.preferredLanguage}
            onValueChange={(value) => updateUserData({ preferredLanguage: value })}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="Swahili">Swahili</SelectItem>
              <SelectItem value="Kikuyu">Kikuyu</SelectItem>
              <SelectItem value="Luo">Luo</SelectItem>
              <SelectItem value="Luhya">Luhya</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex space-x-3">
        {!isFirst && (
          <Button variant="outline" onClick={prevStep} className="flex-1">
            Back
          </Button>
        )}
        <Button 
          onClick={handleNext}
          disabled={!userData.name || !userData.age}
          className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default PersonalInfoStep;
