
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 border-2 border-orange-400 rotate-45"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-orange-300 rounded-full"></div>
        <div className="absolute bottom-40 left-1/4 w-12 h-12 bg-red-300 transform rotate-45"></div>
        <div className="absolute bottom-20 right-1/3 w-24 h-24 border-2 border-amber-400 rounded-full"></div>
      </div>

      <div className="relative max-w-6xl mx-auto text-center animate-fade-in">
        <div className="mb-6">
          <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 text-lg font-semibold">
            NauriCare
          </Badge>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6 leading-tight">
          Empowering Women's Health
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
            Everywhere
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          Bridging the healthcare gap with AI-powered solutions for urban mobile users 
          and accessible USSD platforms for rural women
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 text-lg font-semibold transform transition-all duration-200 hover:scale-105"
          >
            Download Mobile App
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="border-2 border-orange-500 text-orange-600 hover:bg-orange-50 px-8 py-4 text-lg font-semibold"
          >
            Learn About USSD Access
          </Button>
        </div>
        
        <div className="animate-bounce">
          <ArrowDown className="mx-auto text-orange-500" size={32} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
