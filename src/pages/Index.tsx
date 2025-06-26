
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

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50">
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
