
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Services = () => {
  const services = [
    {
      title: "AI-Powered Symptom Checker",
      description: "Get instant health insights with our culturally-adapted AI that understands local health patterns",
      icon: "🔍",
      gradient: "from-orange-400 to-red-400"
    },
    {
      title: "Educational Content",
      description: "Comprehensive modules on fibroids, PCOS, menstrual health, and women's wellness",
      icon: "📚",
      gradient: "from-amber-400 to-orange-400"
    },
    {
      title: "Local Language Support",
      description: "Content and support available in multiple local languages for better accessibility",
      icon: "🗣️",
      gradient: "from-red-400 to-pink-400"
    },
    {
      title: "Community Peer Support",
      description: "Connect with other women in your community for shared experiences and support",
      icon: "👥",
      gradient: "from-orange-500 to-red-500"
    },
    {
      title: "Health Data Collection",
      description: "Anonymous data collection to improve healthcare delivery and research",
      icon: "📊",
      gradient: "from-amber-500 to-orange-500"
    },
    {
      title: "Telehealth Clinics",
      description: "Virtual consultations with qualified healthcare professionals",
      icon: "🏥",
      gradient: "from-red-500 to-pink-500"
    }
  ];

  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Core Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive healthcare solutions designed specifically for women's unique health needs
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${service.gradient} flex items-center justify-center text-2xl`}>
                  {service.icon}
                </div>
                <CardTitle className="text-xl font-bold text-gray-800">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-center text-lg">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
