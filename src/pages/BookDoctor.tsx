
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { ArrowLeft, Calendar as CalendarIcon, Clock } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const BookDoctor = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  const doctors = [
    'Dr. Sarah Johnson - Gynecologist',
    'Dr. Mary Wanjiku - Reproductive Health Specialist',
    'Dr. Grace Muthoni - Women\'s Health Expert',
    'Dr. Jane Kamau - OBGYN Specialist'
  ];

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime || !doctorName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('appointments')
        .insert({
          user_id: user?.id,
          doctor_name: doctorName,
          appointment_date: selectedDate.toISOString().split('T')[0],
          appointment_time: selectedTime,
          notes: notes || null,
          status: 'scheduled'
        });

      if (error) throw error;

      toast({
        title: "Appointment Booked!",
        description: `Your appointment with ${doctorName} has been scheduled for ${selectedDate.toLocaleDateString()} at ${selectedTime}`,
      });

      // Reset form
      setSelectedDate(undefined);
      setSelectedTime('');
      setDoctorName('');
      setNotes('');
      
      // Navigate back to home after a short delay
      setTimeout(() => navigate('/home'), 2000);

    } catch (error: any) {
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to book appointment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center space-x-3 max-w-4xl mx-auto">
          <Button variant="ghost" onClick={() => navigate('/home')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <CalendarIcon className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">Book Doctor</h1>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Schedule Your Appointment
          </h2>
          <p className="text-gray-600">
            Book a consultation with our women's health specialists
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CalendarIcon className="w-5 h-5 text-green-600" />
              <span>Appointment Details</span>
            </CardTitle>
            <CardDescription>
              Choose your preferred date, time, and doctor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleBookAppointment} className="space-y-6">
              {/* Doctor Selection */}
              <div>
                <Label className="text-base font-semibold">Select Doctor *</Label>
                <Select value={doctorName} onValueChange={setDoctorName}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Choose a doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor} value={doctor}>
                        {doctor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date Selection */}
              <div>
                <Label className="text-base font-semibold mb-3 block">Select Date *</Label>
                <Card className="p-4">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                    className="rounded-md border"
                  />
                </Card>
                <p className="text-sm text-gray-600 mt-2">
                  * Weekends are not available for appointments
                </p>
              </div>

              {/* Time Selection */}
              <div>
                <Label className="text-base font-semibold">Select Time *</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      type="button"
                      variant={selectedTime === time ? "default" : "outline"}
                      onClick={() => setSelectedTime(time)}
                      className={`${
                        selectedTime === time 
                          ? "bg-gradient-to-r from-green-500 to-emerald-500" 
                          : ""
                      }`}
                    >
                      <Clock className="w-4 h-4 mr-1" />
                      {time}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <Label htmlFor="notes" className="text-base font-semibold">Additional Notes (Optional)</Label>
                <Input
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any specific concerns or symptoms to discuss..."
                  className="mt-2"
                />
              </div>

              {/* Appointment Summary */}
              {selectedDate && selectedTime && doctorName && (
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-green-800 mb-2">Appointment Summary:</h4>
                    <div className="text-sm text-green-700 space-y-1">
                      <p><strong>Doctor:</strong> {doctorName}</p>
                      <p><strong>Date:</strong> {selectedDate.toLocaleDateString()}</p>
                      <p><strong>Time:</strong> {selectedTime}</p>
                      {notes && <p><strong>Notes:</strong> {notes}</p>}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                disabled={loading || !selectedDate || !selectedTime || !doctorName}
              >
                {loading ? 'Booking Appointment...' : 'Book Appointment'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookDoctor;
