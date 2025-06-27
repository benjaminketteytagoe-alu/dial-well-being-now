
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { ArrowLeft, Calendar as CalendarIcon, Clock } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

const BookDoctor = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [notes, setNotes] = useState('');

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

    if (!selectedDate || !selectedTime || !doctorName.trim()) {
      toast({
        title: "Incomplete Form",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('appointments')
        .insert({
          user_id: user.id,
          doctor_name: doctorName.trim(),
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
        description: `Your appointment with ${doctorName} on ${format(selectedDate, 'PPP')} at ${selectedTime} has been scheduled.`,
      });

      // Reset form
      setSelectedDate(undefined);
      setSelectedTime('');
      setDoctorName('');
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
                {/* Doctor Name */}
                <div>
                  <Label htmlFor="doctor-name">Doctor Name *</Label>
                  <Input
                    id="doctor-name"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    placeholder="Enter doctor's name"
                    required
                  />
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
                {selectedDate && selectedTime && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-800 mb-2">Appointment Summary</h3>
                    <p className="text-green-700">
                      <strong>Date:</strong> {format(selectedDate, 'PPP')}
                    </p>
                    <p className="text-green-700">
                      <strong>Time:</strong> {selectedTime}
                    </p>
                    {doctorName && (
                      <p className="text-green-700">
                        <strong>Doctor:</strong> {doctorName}
                      </p>
                    )}
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  disabled={loading || !selectedDate || !selectedTime || !doctorName.trim()}
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
