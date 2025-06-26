
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const Impact = () => {
  const metrics = [
    {
      number: "50K+",
      label: "Women Served",
      icon: "👩‍⚕️",
      color: "from-orange-400 to-red-400"
    },
    {
      number: "85%",
      label: "Early Detection Rate",
      icon: "🔍",
      color: "from-amber-400 to-orange-400"
    },
    {
      number: "200+",
      label: "Partner Clinics",
      icon: "🏥",
      color: "from-red-400 to-pink-400"
    },
    {
      number: "95%",
      label: "User Satisfaction",
      icon: "⭐",
      color: "from-orange-500 to-red-500"
    }
  ];

  const outcomes = [
    "Improved Health Awareness",
    "Early Diagnosis",
    "Increased Clinic Visits"
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Impact & Outcomes
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Measuring our success through real improvements in women's health outcomes
          </p>
        </div>
        
        {/* Metrics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {metrics.map((metric, index) => (
            <Card 
              key={index} 
              className="border-0 bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center"
            >
              <CardContent className="p-8">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${metric.color} flex items-center justify-center text-2xl`}>
                  {metric.icon}
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-2">
                  {metric.number}
                </div>
                <div className="text-gray-600 font-semibold">
                  {metric.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Outcomes */}
        <div className="text-center">
          <h3 className="text-3xl font-bold text-gray-800 mb-8">Key Outcomes</h3>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
            {outcomes.map((outcome, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-400 to-red-400 flex items-center justify-center">
                  <span className="text-white font-bold">{index + 1}</span>
                </div>
                <span className="text-lg font-semibold text-gray-700">{outcome}</span>
                {index < outcomes.length - 1 && (
                  <div className="hidden sm:block w-8 h-0.5 bg-orange-300"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Impact;
