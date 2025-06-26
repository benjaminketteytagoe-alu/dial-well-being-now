
import React from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, Calendar, Heart } from "lucide-react";

interface NotificationStepProps {
  userData: {
    notifications: {
      health_tips: boolean;
      appointment_reminders: boolean;
      symptom_tracking: boolean;
    };
  };
  updateUserData: (data: any) => void;
  nextStep: () => void;
  prevStep: () => void;
  isFirst: boolean;
}

const NotificationStep: React.FC<NotificationStepProps> = ({
  userData,
  updateUserData,
  nextStep,
  prevStep,
  isFirst
}) => {
  const handleNotificationChange = (key: string, value: boolean) => {
    updateUserData({
      notifications: {
        ...userData.notifications,
        [key]: value
      }
    });
  };

  const notificationOptions = [
    {
      key: 'health_tips',
      icon: Heart,
      title: 'Health Tips',
      description: 'Receive daily health tips and educational content'
    },
    {
      key: 'appointment_reminders',
      icon: Calendar,
      title: 'Appointment Reminders',
      description: 'Get notified about upcoming consultations'
    },
    {
      key: 'symptom_tracking',
      icon: Bell,
      title: 'Symptom Tracking',
      description: 'Reminders to log symptoms and health data'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-gray-800 mb-2">
          Notification Preferences
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Choose how you'd like to stay informed about your health
        </p>
      </div>

      <div className="space-y-4">
        {notificationOptions.map((option) => {
          const IconComponent = option.icon;
          return (
            <div key={option.key} className="flex items-start space-x-4 p-4 border rounded-lg">
              <div className="p-2 bg-orange-100 rounded-lg">
                <IconComponent className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <Label htmlFor={option.key} className="font-medium cursor-pointer">
                  {option.title}
                </Label>
                <p className="text-sm text-gray-600 mt-1">{option.description}</p>
              </div>
              <Switch
                id={option.key}
                checked={userData.notifications[option.key as keyof typeof userData.notifications]}
                onCheckedChange={(checked) => handleNotificationChange(option.key, checked)}
              />
            </div>
          );
        })}
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

export default NotificationStep;
