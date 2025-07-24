
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Heart, AlertCircle } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const HealthInfo = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center space-x-3 max-w-4xl mx-auto">
          <Button variant="ghost" onClick={() => navigate('/home')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <img  
                className="h-8 w-auto"
                src="../../public/logo1b.png"
                alt="logo"
              />
            </div>
            <h1 className="text-xl font-bold text-gray-800">Health Information</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Women's Health Conditions
          </h2>
          <p className="text-gray-600">
            Learn about common conditions affecting women's reproductive health
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Fibroids Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-6 h-6 text-pink-600" />
                <CardTitle className="text-2xl text-pink-600">Fibroids</CardTitle>
              </div>
              <CardDescription>
                Non-cancerous growths in or on the uterus
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">What are Fibroids?</h4>
                <p className="text-gray-600 text-sm">
                  Fibroids are non-cancerous growths that develop in or around the uterus. 
                  They're made of muscle and fibrous tissue and can vary in size.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Common Symptoms:</h4>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Heavy or prolonged menstrual periods</li>
                  <li>• Pelvic pain or pressure</li>
                  <li>• Frequent urination</li>
                  <li>• Difficulty emptying the bladder</li>
                  <li>• Constipation</li>
                  <li>• Backache or leg pains</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">When to See a Doctor:</h4>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Persistent pelvic pain</li>
                  <li>• Heavy, prolonged or painful periods</li>
                  <li>• Bleeding between periods</li>
                  <li>• Difficulty getting pregnant</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* PCOS Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-6 h-6 text-blue-600" />
                <CardTitle className="text-2xl text-blue-600">PCOS</CardTitle>
              </div>
              <CardDescription>
                Polycystic Ovary Syndrome
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">What is PCOS?</h4>
                <p className="text-gray-600 text-sm">
                  PCOS is a hormonal disorder common among women of reproductive age. 
                  It affects how the ovaries work and can impact fertility.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Common Symptoms:</h4>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Irregular or no periods</li>
                  <li>• Excessive hair growth (face, chest, back)</li>
                  <li>• Weight gain or difficulty losing weight</li>
                  <li>• Thinning hair or male-pattern baldness</li>
                  <li>• Acne or oily skin</li>
                  <li>• Skin darkening</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Management Tips:</h4>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Maintain a healthy weight</li>
                  <li>• Exercise regularly</li>
                  <li>• Follow a balanced diet</li>
                  <li>• Take prescribed medications</li>
                  <li>• Regular medical check-ups</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <h3 className="font-semibold text-amber-800">Important Note</h3>
              </div>
              <p className="text-amber-700 text-sm">
                This information is for educational purposes only and should not replace professional medical advice. 
                Always consult with a healthcare provider for proper diagnosis and treatment.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HealthInfo;
