
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Stethoscope, Calendar, MessageSquare, FileText } from "lucide-react";

const QuickActions = () => {
  const actions = [
    {
      title: "Symptom Check",
      description: "Quick health assessment",
      icon: Stethoscope,
      color: "bg-gradient-to-r from-red-500 to-pink-500"
    },
    {
      title: "Book Appointment",
      description: "Schedule with doctor",
      icon: Calendar,
      color: "bg-gradient-to-r from-blue-500 to-cyan-500"
    },
    {
      title: "Chat Support",
      description: "24/7 health chat",
      icon: MessageSquare,
      color: "bg-gradient-to-r from-green-500 to-emerald-500"
    },
    {
      title: "Health Records",
      description: "View your history",
      icon: FileText,
      color: "bg-gradient-to-r from-orange-500 to-yellow-500"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common health tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="w-full h-16 flex items-center justify-start space-x-3 hover:scale-105 transition-transform"
            >
              <div className={`p-2 rounded-lg ${action.color}`}>
                <action.icon className="text-white" size={20} />
              </div>
              <div className="text-left">
                <p className="font-medium">{action.title}</p>
                <p className="text-xs text-gray-500">{action.description}</p>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
