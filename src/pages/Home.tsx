
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Search, Calendar, LogOut } from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <img  
                className="h-8 w-auto"
                src="https://i.ibb.co/whR2z9DX/logo1b.png"
                alt="logo"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">NauriCare</h1>
              <p className="text-sm text-gray-600">Welcome, {user?.user_metadata?.full_name || user?.email}</p>
            </div>
          </div>
          <Button variant="ghost" onClick={handleSignOut}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            How can we help you today?
          </h2>
          <p className="text-gray-600">
            Choose from our health services designed specifically for women
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Health Info Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/health-info')}>
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl">Health Info</CardTitle>
              <CardDescription>
                Learn about fibroids and PCOS
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/health-info');
                }}
              >
                Learn More
              </Button>
            </CardContent>
          </Card>

          {/* Symptom Checker Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/symptom-checker')}>
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl">Symptom Checker</CardTitle>
              <CardDescription>
                Check your symptoms and get insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/symptom-checker');
                }}
              >
                Check Symptoms
              </Button>
            </CardContent>
          </Card>

          {/* Book Doctor Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/book-doctor')}>
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl">Book Doctor</CardTitle>
              <CardDescription>
                Schedule an appointment with a specialist
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/book-doctor');
                }}
              >
                Book Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
