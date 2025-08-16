import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { ArrowLeft, Video, Phone, MessageSquare, Clock, Calendar as CalendarIcon, User, Stethoscope } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

import { TeleconsultationService, AvailableTimeSlot, TeleconsultationSession } from '@/services/teleconsultationService';
import { format, addDays, startOfDay } from 'date-fns';

const Teleconsultation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedSessionType, setSelectedSessionType] = useState<'video' | 'audio' | 'chat'>('video');
  const [availableSlots, setAvailableSlots] = useState<AvailableTimeSlot[]>([]);
  const [userSessions, setUserSessions] = useState<TeleconsultationSession[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<AvailableTimeSlot | null>(null);

  const sessionTypes = [
    { value: 'video', label: 'Video Call', icon: Video, description: 'Face-to-face consultation with video' },
    { value: 'audio', label: 'Audio Call', icon: Phone, description: 'Voice-only consultation' },
    { value: 'chat', label: 'Text Chat', icon: MessageSquare, description: 'Text-based consultation' }
  ];

  useEffect(() => {
    if (user) {
      loadUserSessions();
    }
  }, [user]);

  useEffect(() => {
    if (selectedDate) {
      loadAvailableSlots();
    }
  }, [selectedDate, selectedSessionType]);

  const loadUserSessions = async () => {
    if (!user) return;
    
    try {
      const sessions = await TeleconsultationService.getUserSessions(user.id);
      setUserSessions(sessions);
    } catch (error) {
      console.error('Error loading user sessions:', error);
      toast({
        title: "Error",
        description: "Failed to load your sessions.",
        variant: "destructive"
      });
    }
  };

  const loadAvailableSlots = async () => {
    if (!selectedDate) return;
    
    setLoading(true);
    try {
      const startDate = startOfDay(selectedDate);
      const endDate = addDays(startDate, 7); // Show slots for next 7 days
      
      const slots = await TeleconsultationService.getAvailableTimeSlots(
        startDate,
        endDate,
        selectedSessionType
      );
      
      setAvailableSlots(slots);
    } catch (error) {
      console.error('Error loading available slots:', error);
      toast({
        title: "Error",
        description: "Failed to load available time slots.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBookSession = async () => {
    if (!selectedSlot || !user) return;
    
    setLoading(true);
    try {
      const session = await TeleconsultationService.bookSession(
        user.id,
        selectedSlot.doctor_id,
        selectedSlot.session_type,
        `${selectedSlot.date}T${selectedSlot.time}`,
        30,
        `Teleconsultation session with ${selectedSlot.doctor_name}`
      );

      toast({
        title: "Session Booked",
        description: `Your ${selectedSlot.session_type} session with ${selectedSlot.doctor_name} has been scheduled for ${format(new Date(session.scheduled_start_time), 'PPP p')}.`,
      });

      // Reset selection and reload sessions
      setSelectedSlot(null);
      await loadUserSessions();
      await loadAvailableSlots();
    } catch (error) {
      console.error('Error booking session:', error);
      toast({
        title: "Booking Error",
        description: "Failed to book your session. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'audio': return Phone;
      case 'chat': return MessageSquare;
      default: return MessageSquare;
    }
  };

  // Add navigation to session
  const handleJoinSession = (sessionId: string) => {
    navigate(`/teleconsultation/session/${sessionId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center space-x-3 max-w-6xl mx-auto">
          <Button variant="ghost" onClick={() => navigate('/home')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center space-x-3">
            <img  
              className="h-8 w-auto"
              src="https://i.ibb.co/whR2z9DX/logo1b.png"
              alt="logo"
            />
            <h1 className="text-xl font-bold text-gray-800">Teleconsultation</h1>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Virtual Doctor Consultations
          </h2>
          <p className="text-gray-600">
            Connect with healthcare professionals from the comfort of your home
          </p>
        </div>

        <Tabs defaultValue="book" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="book">Book Session</TabsTrigger>
            <TabsTrigger value="sessions">My Sessions</TabsTrigger>
          </TabsList>

          <TabsContent value="book" className="space-y-6">
            {/* Session Type Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Choose Consultation Type</CardTitle>
                <CardDescription>
                  Select how you'd like to connect with your doctor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {sessionTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <Button
                        key={type.value}
                        variant={selectedSessionType === type.value ? "default" : "outline"}
                        className={`h-auto p-4 flex flex-col items-center space-y-2 ${
                          selectedSessionType === type.value 
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white" 
                            : ""
                        }`}
                        onClick={() => setSelectedSessionType(type.value as 'video' | 'audio' | 'chat')}
                      >
                        <Icon className="w-6 h-6" />
                        <div className="text-center">
                          <div className="font-semibold">{type.label}</div>
                          <div className="text-xs opacity-80">{type.description}</div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Date and Time Selection */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CalendarIcon className="w-5 h-5" />
                    <span>Select Date</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>Available Time Slots</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  ) : selectedDate ? (
                    <div className="space-y-3">
                      {availableSlots.length > 0 ? (
                        availableSlots
                          .filter(slot => slot.date === format(selectedDate, 'yyyy-MM-dd'))
                          .map((slot) => (
                            <Button
                              key={`${slot.doctor_id}-${slot.time}`}
                              variant={selectedSlot === slot ? "default" : "outline"}
                              className={`w-full justify-between ${
                                selectedSlot === slot 
                                  ? "bg-gradient-to-r from-blue-500 to-purple-500" 
                                  : ""
                              }`}
                              onClick={() => setSelectedSlot(slot)}
                            >
                              <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4" />
                                <span>{slot.time}</span>
                              </div>
                              <div className="text-right">
                                <div className="font-medium">{slot.doctor_name}</div>
                                <div className="text-xs opacity-80">{slot.specialty}</div>
                              </div>
                            </Button>
                          ))
                      ) : (
                        <p className="text-center text-gray-500 py-4">
                          No available slots for this date. Please select another date.
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-4">
                      Please select a date to view available time slots.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Booking Summary and Action */}
            {selectedSlot && (
              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <CardHeader>
                  <CardTitle>Session Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span><strong>Doctor:</strong> {selectedSlot.doctor_name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Stethoscope className="w-4 h-4" />
                        <span><strong>Specialty:</strong> {selectedSlot.specialty}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <CalendarIcon className="w-4 h-4" />
                        <span><strong>Date:</strong> {format(new Date(selectedSlot.date), 'PPP')}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span><strong>Time:</strong> {selectedSlot.time}</span>
                      </div>
                    </div>
                  </div>
                  <Button 
                    onClick={handleBookSession}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  >
                    {loading ? 'Booking...' : 'Book Teleconsultation Session'}
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="sessions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Teleconsultation Sessions</CardTitle>
                <CardDescription>
                  View and manage your scheduled and completed sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userSessions.length > 0 ? (
                  <div className="space-y-4">
                    {userSessions.map((session) => {
                      const Icon = getSessionTypeIcon(session.session_type);
                      return (
                        <Card key={session.id} className="border-l-4 border-l-blue-500">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <Icon className="w-5 h-5 text-blue-500" />
                                <div>
                                  <div className="font-semibold">
                                    {session.doctor?.name || 'Unknown Doctor'}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {session.doctor?.specialty || 'General'}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {format(new Date(session.scheduled_start_time), 'PPP p')}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge className={getStatusColor(session.status)}>
                                  {session.status.replace('-', ' ')}
                                </Badge>
                                {session.status === 'scheduled' && session.meeting_url && (
                                  <Button size="sm" onClick={() => handleJoinSession(session.id)}>
                                    Join
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No teleconsultation sessions found.</p>
                    <p className="text-sm text-gray-400">Book your first session to get started.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Teleconsultation; 