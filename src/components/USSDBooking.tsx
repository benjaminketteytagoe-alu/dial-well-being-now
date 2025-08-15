import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Smartphone, 
  Phone, 
  MessageSquare, 
  Globe, 
  Calendar, 
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface USSDStep {
  step: number;
  title: string;
  description: string;
  code: string;
  response: string;
}

const USSDBooking = () => {
  const { toast } = useToast();
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [showDemo, setShowDemo] = useState(false);

  const languages = [
    { code: 'en', name: 'English', label: 'English' },
    { code: 'sw', name: 'Kiswahili', label: 'Kiswahili' },
    { code: 'fr', name: 'Français', label: 'French' },
    { code: 'ha', name: 'Hausa', label: 'Hausa' },
    { code: 'am', name: 'አማርኛ', label: 'Amharic' },
    { code: 'yo', name: 'Yorùbá', label: 'Yoruba' }
  ];

  const ussdSteps: { [key: string]: USSDStep[] } = {
    en: [
      {
        step: 1,
        title: 'Welcome to NauriCare',
        description: 'Dial the USSD code to start',
        code: '*384*1#',
        response: 'Welcome to NauriCare\n1. Book Doctor\n2. Check Appointment\n3. Health Tips\n4. Emergency\n0. Exit'
      },
      {
        step: 2,
        title: 'Book a Doctor',
        description: 'Select booking option',
        code: '1',
        response: 'Book a Doctor\n1. General Doctor\n2. Gynecologist\n3. Cardiologist\n4. Pediatrician\n0. Back'
      },
      {
        step: 3,
        title: 'Select Specialty',
        description: 'Choose gynecologist for women\'s health',
        code: '2',
        response: 'Gynecologist Available\n1. Dr. Amina Hassan - Today 2PM\n2. Dr. Grace Mwangi - Tomorrow 10AM\n3. Dr. Sarah Okoye - Tomorrow 3PM\n0. Back'
      },
      {
        step: 4,
        title: 'Select Doctor & Time',
        description: 'Choose available appointment',
        code: '1',
        response: 'Confirm Booking:\nDr. Amina Hassan\nToday at 2:00 PM\nFee: 2000 KES\n1. Confirm\n2. Change\n0. Cancel'
      },
      {
        step: 5,
        title: 'Confirmation',
        description: 'Confirm your appointment',
        code: '1',
        response: 'Booking Confirmed!\nRef: NAURI2024001\nDr. Amina Hassan\nToday 2:00 PM\nLocation sent via SMS\nThank you!'
      }
    ],
    sw: [
      {
        step: 1,
        title: 'Karibu NauriCare',
        description: 'Piga nambari ya USSD kuanza',
        code: '*384*1#',
        response: 'Karibu NauriCare\n1. Panga Daktari\n2. Angalia Miadi\n3. Ushauri wa Afya\n4. Dharura\n0. Toka'
      },
      {
        step: 2,
        title: 'Panga Daktari',
        description: 'Chagua aina ya daktari',
        code: '1',
        response: 'Panga Daktari\n1. Daktari wa Jumla\n2. Daktari wa Wanawake\n3. Daktari wa Moyo\n4. Daktari wa Watoto\n0. Nyuma'
      },
      {
        step: 3,
        title: 'Chagua Utaalamu',
        description: 'Chagua daktari wa wanawake',
        code: '2',
        response: 'Daktari wa Wanawake\n1. Dk. Amina Hassan - Leo 2PM\n2. Dk. Grace Mwangi - Kesho 10AM\n3. Dk. Sarah Okoye - Kesho 3PM\n0. Nyuma'
      },
      {
        step: 4,
        title: 'Chagua Daktari na Wakati',
        description: 'Chagua miadi inayopatikana',
        code: '1',
        response: 'Thibitisha Kupanga:\nDk. Amina Hassan\nLeo saa 2:00 PM\nAda: 2000 KES\n1. Thibitisha\n2. Badilisha\n0. Ghairi'
      },
      {
        step: 5,
        title: 'Uthibitisho',
        description: 'Thibitisha miadi yako',
        code: '1',
        response: 'Kupanga Kumekamilika!\nRef: NAURI2024001\nDk. Amina Hassan\nLeo 2:00 PM\nMahali pametumwa SMS\nAsante!'
      }
    ]
  };

  const startDemo = () => {
    if (!phoneNumber) {
      toast({
        title: 'Phone Number Required',
        description: 'Please enter your phone number to start the demo.',
        variant: 'destructive'
      });
      return;
    }

    setShowDemo(true);
    setCurrentStep(0);
    
    toast({
      title: 'USSD Demo Started',
      description: `Demo will work on ${phoneNumber} in ${languages.find(l => l.code === selectedLanguage)?.name}`,
    });
  };

  const nextStep = () => {
    const steps = ussdSteps[selectedLanguage] || ussdSteps.en;
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowDemo(false);
      setCurrentStep(0);
      toast({
        title: 'Booking Complete',
        description: 'Your appointment has been successfully booked!',
      });
    }
  };

  const resetDemo = () => {
    setShowDemo(false);
    setCurrentStep(0);
  };

  const currentStepData = (ussdSteps[selectedLanguage] || ussdSteps.en)[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
            <Phone className="h-8 w-8 text-orange-500" />
            USSD Booking Service
          </h1>
          <p className="text-gray-600">Book consultations without internet or smartphone</p>
          <Badge variant="secondary" className="mt-2">
            Available 24/7 on all networks
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Service Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-500" />
                  How USSD Booking Works
                </CardTitle>
                <CardDescription>
                  Simple steps to book your appointment using any phone
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                    1
                  </div>
                  <div>
                    <h3 className="font-medium">Dial USSD Code</h3>
                    <p className="text-sm text-gray-600">Dial *384*1# from any phone</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                    2
                  </div>
                  <div>
                    <h3 className="font-medium">Select Language</h3>
                    <p className="text-sm text-gray-600">Choose from 6+ local languages</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                    3
                  </div>
                  <div>
                    <h3 className="font-medium">Select Doctor Type</h3>
                    <p className="text-sm text-gray-600">Choose specialty and available times</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                    4
                  </div>
                  <div>
                    <h3 className="font-medium">Get Confirmation</h3>
                    <p className="text-sm text-gray-600">Receive appointment details via SMS</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-green-500" />
                  Benefits for Rural Women
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-sm">No internet needed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Works on basic phones</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Multiple languages</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-sm">24/7 availability</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Low cost access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-sm">SMS confirmations</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-red-500" />
                  Coverage Areas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Kenya</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Tanzania</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Uganda</span>
                    <Badge variant="secondary">Coming Soon</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Nigeria</span>
                    <Badge variant="secondary">Coming Soon</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Ethiopia</span>
                    <Badge variant="secondary">Coming Soon</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Interactive Demo */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-purple-500" />
                  Try USSD Demo
                </CardTitle>
                <CardDescription>
                  Experience how USSD booking works on your phone
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="phone">Your Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+254 700 000 000"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="language">Preferred Language</Label>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4">
                  {!showDemo ? (
                    <Button onClick={startDemo} className="w-full">
                      Start USSD Demo
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <Button onClick={resetDemo} variant="outline" size="sm">
                        Reset Demo
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {showDemo && currentStepData && (
              <Card className="border-2 border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>USSD Interface</span>
                    <Badge variant="outline">
                      Step {currentStep + 1} of {(ussdSteps[selectedLanguage] || ussdSteps.en).length}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {currentStepData.title}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-black text-green-400 p-4 rounded font-mono text-sm">
                      <div className="mb-2">
                        <span className="text-yellow-400">USSD:</span> {currentStepData.code}
                      </div>
                      <div className="whitespace-pre-line">
                        {currentStepData.response}
                      </div>
                    </div>

                    <div className="text-sm text-gray-600">
                      {currentStepData.description}
                    </div>

                    <Button 
                      onClick={nextStep} 
                      className="w-full"
                      disabled={currentStep === (ussdSteps[selectedLanguage] || ussdSteps.en).length - 1}
                    >
                      {currentStep === (ussdSteps[selectedLanguage] || ussdSteps.en).length - 1 
                        ? 'Complete Booking' 
                        : 'Next Step'
                      }
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                  Important Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                  <p>USSD rates apply as per your network provider</p>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                  <p>Appointments can be cancelled by calling our helpline</p>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                  <p>SMS confirmations will be sent to your registered number</p>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                  <p>For emergencies, call 911 or visit the nearest health facility</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Helpline: 0800-NAURICARE</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-green-500" />
                  <span className="text-sm">SMS: Text HELP to 40404</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-500" />
                  <span className="text-sm">Community Health Workers available</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default USSDBooking;