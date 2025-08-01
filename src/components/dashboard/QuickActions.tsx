
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Stethoscope, 
  MessageSquare, 
  Users, 
  Activity,
  BookOpen,
  Heart
} from "lucide-react";
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Book Appointment",
      description: "Schedule with a specialist",
      icon: Calendar,
      action: () => navigate('/book-doctor'),
      color: "bg-blue-500"
    },
    {
      title: "Symptom Checker",
      description: "AI-powered health assessment",
      icon: Stethoscope,
      action: () => navigate('/symptom-checker'),
      color: "bg-green-500"
    },
    {
      title: "Teleconsultation",
      description: "Virtual doctor sessions",
      icon: MessageSquare,
      action: () => navigate('/teleconsultation'),
      color: "bg-purple-500"
    },
    {
      title: "Community Support",
      description: "Connect with peers",
      icon: Users,
      action: () => navigate('/community'),
      color: "bg-orange-500"
    },
    {
      title: "Health Info",
      description: "Educational resources",
      icon: BookOpen,
      action: () => navigate('/health-info'),
      color: "bg-red-500"
    },
    {
      title: "Health Tips",
      description: "Daily wellness advice",
      icon: Heart,
      action: () => navigate('/dashboard'),
      color: "bg-pink-500"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Access your most used features</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-3 flex flex-col items-center space-y-2 hover:shadow-md transition-shadow"
                onClick={action.action}
              >
                <div className={`p-2 rounded-full ${action.color} text-white`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium">{action.title}</div>
                  <div className="text-xs text-gray-500">{action.description}</div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
