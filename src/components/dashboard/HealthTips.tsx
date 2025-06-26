
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, ChevronRight } from "lucide-react";

const HealthTips = () => {
  const tips = [
    {
      id: 1,
      title: "Stay Hydrated",
      description: "Drink at least 8 glasses of water daily for optimal health.",
      category: "Nutrition"
    },
    {
      id: 2,
      title: "Regular Exercise",
      description: "30 minutes of moderate exercise can boost your immune system.",
      category: "Fitness"
    },
    {
      id: 3,
      title: "Quality Sleep",
      description: "7-9 hours of sleep helps your body recover and repair.",
      category: "Wellness"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Lightbulb size={20} />
          <span>Health Tips</span>
        </CardTitle>
        <CardDescription>Daily wellness recommendations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tips.map((tip) => (
            <div key={tip.id} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-grow">
                  <h4 className="font-medium text-sm mb-1">{tip.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{tip.description}</p>
                  <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded">
                    {tip.category}
                  </span>
                </div>
                <ChevronRight className="text-gray-400 flex-shrink-0 ml-2" size={16} />
              </div>
            </div>
          ))}
          <Button className="w-full" variant="outline">
            View More Tips
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthTips;
