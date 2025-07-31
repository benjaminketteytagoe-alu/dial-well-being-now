
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Calendar as CalendarIcon, Clock } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

const BookDoctor = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [notes, setNotes] = useState('');

  const doctors = [
    { id: 'dr-sarah-johnson', name: 'Dr. Sarah Johnson', specialty: 'Gynecologist' },
    { id: 'dr-michael-chen', name: 'Dr. Michael Chen', specialty: 'Internal Medicine' },
    { id: 'dr-emily-davis', name: 'Dr. Emily Davis', specialty: 'Family Medicine' },
    { id: 'dr-robert-wilson', name: 'Dr. Robert Wilson', specialty: 'Endocrinologist' },
    { id: 'dr-lisa-martinez', name: 'Dr. Lisa Martinez', specialty: 'Gynecologist' },
    { id: 'dr-david-brown', name: 'Dr. David Brown', specialty: 'Internal Medicine' }
  ];

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to book an appointment.",
        variant: "destructive"
      });
      return;
    }

    if (!selectedDate || !selectedTime || !selectedDoctor) {
      toast({
        title: "Incomplete Form",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const selectedDoctorInfo = doctors.find(d => d.id === selectedDoctor);
      
      const { error } = await supabase
        .from('appointments')
        .insert({
          user_id: user.id,
          doctor_name: selectedDoctorInfo?.name || selectedDoctor,
          appointment_date: format(selectedDate, 'yyyy-MM-dd'),
          appointment_time: selectedTime,
          notes: notes.trim() || null,
          status: 'scheduled'
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Appointment Booked",
        description: `Your appointment with ${selectedDoctorInfo?.name} on ${format(selectedDate, 'PPP')} at ${selectedTime} has been scheduled.`,
      });

      // Reset form
      setSelectedDate(undefined);
      setSelectedTime('');
      setSelectedDoctor('');
      setNotes('');

    } catch (error) {
      console.error('Error booking appointment:', error);
      toast({
        title: "Booking Error",
        description: "Failed to book your appointment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedDoctorInfo = doctors.find(d => d.id === selectedDoctor);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center space-x-3 max-w-4xl mx-auto">
          <Button variant="ghost" onClick={() => navigate('/home')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center space-x-3">
            <img  
              className="h-8 w-auto"
              src="https://i.ibb.co/whR2z9DX/logo1b.png"
              alt="logo"
            />
            <h1 className="text-xl font-bold text-gray-800">{t('doctor.title')}</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Schedule Your Appointment
          </h2>
          <p className="text-gray-600">
            Choose a convenient date and time for your consultation
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calendar */}
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

          {/* Appointment Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Appointment Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Doctor Selection */}
                <div>
                  <Label htmlFor="doctor-select">Select Doctor *</Label>
                  <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{doctor.name}</span>
                            <span className="text-sm text-gray-500">{doctor.specialty}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedDoctorInfo && (
                    <p className="text-sm text-gray-600 mt-1">
                      Specialty: {selectedDoctorInfo.specialty}
                    </p>
                  )}
                </div>

                {/* Time Selection */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">
                    Available Time Slots *
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        type="button"
                        variant={selectedTime === time ? "default" : "outline"}
                        className={`${
                          selectedTime === time 
                            ? "bg-gradient-to-r from-green-500 to-emerald-500" 
                            : ""
                        }`}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any specific concerns or requirements..."
                    rows={3}
                  />
                </div>

                {/* Selected Details */}
                {selectedDate && selectedTime && selectedDoctorInfo && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-800 mb-2">Appointment Summary</h3>
                    <p className="text-green-700">
                      <strong>Doctor:</strong> {selectedDoctorInfo.name} ({selectedDoctorInfo.specialty})
                    </p>
                    <p className="text-green-700">
                      <strong>Date:</strong> {format(selectedDate, 'PPP')}
                    </p>
                    <p className="text-green-700">
                      <strong>Time:</strong> {selectedTime}
                    </p>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  disabled={loading || !selectedDate || !selectedTime || !selectedDoctor}
                >
                  {loading ? 'Booking...' : 'Book Appointment'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookDoctor;
