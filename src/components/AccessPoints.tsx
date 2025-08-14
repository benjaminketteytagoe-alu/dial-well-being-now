
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const AccessPoints = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-r from-orange-100 to-red-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            User Entry Points
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Two powerful platforms designed for different access needs
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Urban Mobile App */}
          <Card className="border-0 bg-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <CardHeader className="text-center pb-4">
              <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white w-fit mx-auto mb-4 px-4 py-2">
                Urban Users
              </Badge>
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-3xl">
                📱
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800">
                Mobile Application
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Full-featured smartphone app with advanced capabilities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Interactive symptom checker with AI</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-700">Health tracking and progress monitoring</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Video consultations with doctors</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-700">Educational modules and resources</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Community peer support groups</span>
                </div>
              </div>
              <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white mt-6">
                Download App
              </Button>
            </CardContent>
          </Card>

          {/* Rural USSD Platform */}
          <Card className="border-0 bg-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <CardHeader className="text-center pb-4">
              <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white w-fit mx-auto mb-4 px-4 py-2">
                Rural Users
              </Badge>
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-orange-400 to-red-400 flex items-center justify-center text-3xl">
                📞
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800">
                USSD Platform
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Simple dial-and-respond system for basic phones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-orange-50 p-4 rounded-lg mb-4">
                <p className="text-center text-gray-700 font-semibold text-lg">
                  Dial: <span className="text-orange-600">*111#</span>
                </p>
                <p className="text-center text-gray-600 text-sm mt-2">
                  Works on any mobile phone
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-gray-700">Interactive health screening</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-gray-700">Frequently asked questions</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-gray-700">Nearest clinic locator</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-gray-700">Local language support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-gray-700">SMS follow-up and reminders</span>
                </div>
              </div>
              <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white mt-6">
                Try USSD Demo
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AccessPoints;
