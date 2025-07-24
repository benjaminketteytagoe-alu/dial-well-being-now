
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, ArrowUp } from "lucide-react";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import AccessPoints from "@/components/AccessPoints";
import Impact from "@/components/Impact";
import Partners from "@/components/Partners";
import SymptomChecker from "@/components/SymptomChecker";
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img  
                className="h-8 w-auto"
                src="../../public/NauriCare ColorB.png"
                alt="logo"
              />
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline"
                onClick={() => navigate('/auth')}
              >
                Sign In
              </Button>
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <Hero />
      <Services />
      <AccessPoints />
      <SymptomChecker />
      <Impact />
      <Partners />
    </div>
  );
};

export default Index;
