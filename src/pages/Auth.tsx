
// @ts-nocheck
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSelector } from '@/components/LanguageSelector';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('');
  const [signupReason, setSignupReason] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    if (user) {
      navigate('/home');
    }
  }, [user, navigate]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await signIn(email, password);
    
    if (error) {
      toast({
        title: "Sign In Error",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in."
      });
    }
    
    setLoading(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await signUp(email, password, fullName, gender, signupReason);
    
    if (error) {
      toast({
        title: "Sign Up Error",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Account Created!",
        description: "Please check your email to verify your account."
      });
    }
    
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    
    const { error } = await signInWithGoogle();
    
    if (error) {
      toast({
        title: "Google Sign In Error",
        description: error.message,
        variant: "destructive"
      });
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center p-4">
      <div className="w-full max-w-md relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/')}
          className="absolute -top-12 left-0 text-brand-dark hover:text-brand-primary"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('auth.back')}
        </Button>
        <Card className="w-full shadow-brand-shadow">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-auto h-12">
            <img
              className="h-9 w-auto"
              src="https://i.ibb.co/4ZyKvZJx/Nauri-Care-Color-B.png"
              alt="logo"
            />
          </div>
          <CardTitle className="text-2xl font-bold">{t('auth.welcome')}</CardTitle>
          <CardDescription>
            {t('auth.tagline')}
          </CardDescription>
          <div className="flex justify-center">
            <LanguageSelector />
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">{t('auth.signIn')}</TabsTrigger>
              <TabsTrigger value="signup">{t('auth.signUp')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <Label htmlFor="email">{t('auth.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">{t('auth.password')}</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={loading}
                >
                  {loading ? t('auth.signingIn') : t('auth.signIn')}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <Label htmlFor="fullName">{t('auth.fullName')}</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="signupEmail">{t('auth.email')}</Label>
                  <Input
                    id="signupEmail"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="signupPassword">{t('auth.password')}</Label>
                  <Input
                    id="signupPassword"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label>Gender</Label>
                  <RadioGroup value={gender} onValueChange={setGender} className="flex flex-wrap gap-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">Female</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other">Other</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="prefer_not_to_say" id="prefer_not_to_say" />
                      <Label htmlFor="prefer_not_to_say">Prefer not to say</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div>
                  <Label htmlFor="signupReason">Why are you joining NauriCare?</Label>
                  <Select value={signupReason} onValueChange={setSignupReason}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your primary reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reproductive_health">Reproductive Health</SelectItem>
                      <SelectItem value="pregnancy_tracking">Pregnancy Tracking</SelectItem>
                      <SelectItem value="fertility_planning">Fertility Planning</SelectItem>
                      <SelectItem value="menstrual_health">Menstrual Health</SelectItem>
                      <SelectItem value="general_wellness">General Wellness</SelectItem>
                      <SelectItem value="healthcare_access">Healthcare Access</SelectItem>
                      <SelectItem value="teleconsultation">Teleconsultation</SelectItem>
                      <SelectItem value="health_education">Health Education</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={loading || !gender || !signupReason}
                >
                  {loading ? t('auth.creatingAccount') : t('auth.signUp')}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">{t('auth.continueWith')}</span>
              </div>
            </div>
            
            <Button 
              onClick={handleGoogleSignIn}
              variant="outline" 
              className="w-full mt-4"
              disabled={loading}
            >
              {loading ? t('auth.connecting') : t('auth.google')}
            </Button>
          </div>
        </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
