import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Search, 
  MapPin, 
  Star, 
  Phone, 
  Calendar, 
  Clock, 
  Filter,
  Heart,
  ExternalLink,
  Navigation,
  Award,
  Users
} from "lucide-react";
import { ReferralRecommendation } from '@/services/aiService';
import { DatabaseService, DoctorRecord, HospitalRecord } from '@/services/databaseService';
import { useToast } from '@/hooks/use-toast';

interface ReferralEngineProps {
  initialCondition?: string;
  onBookingComplete?: (booking: any) => void;
}

interface Hospital {
  id: string;
  name: string;
  location: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  facilities: string[];
  insurance: string[];
  doctors: Doctor[];
  contactInfo: {
    phone: string;
    email: string;
    website: string;
  };
  availability: {
    days: string[];
    hours: string;
    emergency: boolean;
  };
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  subSpecialty?: string;
  rating: number;
  reviewCount: number;
  experience: string;
  education: string[];
  languages: string[];
  availability: {
    days: string[];
    hours: string;
    nextAvailable: string;
  };
  consultationFee: number;
  hospitalId: string;
}

const ReferralEngine: React.FC<ReferralEngineProps> = ({ initialCondition, onBookingComplete }) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [availability, setAvailability] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [bookingStep, setBookingStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState<DoctorRecord[]>([]);
  const [hospitals, setHospitals] = useState<HospitalRecord[]>([]);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    reason: '',
    notes: ''
  });

  // Load data from database
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [doctorsData, hospitalsData] = await Promise.all([
          DatabaseService.getDoctors(),
          DatabaseService.getHospitals()
        ]);
        setDoctors(doctorsData);
        setHospitals(hospitalsData);
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: "Data Loading Error",
          description: "Failed to load hospital and doctor data.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [toast]);

  // Mock data - fallback if database fails
  const mockHospitals: Hospital[] = [
    {
      id: '1',
      name: "Nairobi Women's Hospital",
      location: "Nairobi, Kenya",
      specialties: ["Gynecology", "Obstetrics", "Reproductive Health", "Fertility"],
      rating: 4.8,
      reviewCount: 1247,
      facilities: ["24/7 Emergency", "Laboratory", "Imaging", "Pharmacy"],
      insurance: ["NHIF", "AAR", "CIC", "Jubilee"],
      contactInfo: {
        phone: "+254 20 123 4567",
        email: "info@nwh.co.ke",
        website: "www.nwh.co.ke"
      },
      availability: {
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        hours: "8:00 AM - 6:00 PM",
        emergency: true
      },
      doctors: [
        {
          id: 'd1',
          name: "Dr. Sarah Mwangi",
          specialty: "Gynecologist",
          subSpecialty: "PCOS Specialist",
          rating: 4.9,
          reviewCount: 234,
          experience: "15+ years",
          education: ["MBChB - University of Nairobi", "MSc Gynecology - University of London"],
          languages: ["English", "Swahili", "Kikuyu"],
          availability: {
            days: ["Monday", "Wednesday", "Friday"],
            hours: "9:00 AM - 5:00 PM",
            nextAvailable: "2024-01-15"
          },
          consultationFee: 5000,
          hospitalId: '1'
        },
        {
          id: 'd2',
          name: "Dr. James Ochieng",
          specialty: "Obstetrician",
          subSpecialty: "High-Risk Pregnancy",
          rating: 4.7,
          reviewCount: 189,
          experience: "12+ years",
          education: ["MBChB - Moi University", "Fellowship in Maternal-Fetal Medicine"],
          languages: ["English", "Swahili", "Luo"],
          availability: {
            days: ["Tuesday", "Thursday", "Saturday"],
            hours: "8:00 AM - 4:00 PM",
            nextAvailable: "2024-01-16"
          },
          consultationFee: 6000,
          hospitalId: '1'
        }
      ]
    },
    {
      id: '2',
      name: "Aga Khan University Hospital",
      location: "Nairobi, Kenya",
      specialties: ["Endocrinology", "Gynecology", "Maternal Health", "Fertility"],
      rating: 4.9,
      reviewCount: 2156,
      facilities: ["Research Center", "Advanced Imaging", "Specialized Labs", "Pharmacy"],
      insurance: ["NHIF", "AAR", "CIC", "Jubilee", "Allianz"],
      contactInfo: {
        phone: "+254 20 234 5678",
        email: "appointments@aku.edu",
        website: "www.aku.edu"
      },
      availability: {
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        hours: "8:00 AM - 5:00 PM",
        emergency: true
      },
      doctors: [
        {
          id: 'd3',
          name: "Dr. Fatima Hassan",
          specialty: "Endocrinologist",
          subSpecialty: "PCOS & Diabetes",
          rating: 4.9,
          reviewCount: 312,
          experience: "18+ years",
          education: ["MBChB - University of Nairobi", "PhD Endocrinology - Harvard"],
          languages: ["English", "Swahili", "Arabic"],
          availability: {
            days: ["Monday", "Wednesday", "Friday"],
            hours: "9:00 AM - 5:00 PM",
            nextAvailable: "2024-01-17"
          },
          consultationFee: 8000,
          hospitalId: '2'
        },
        {
          id: 'd4',
          name: "Dr. Peter Kamau",
          specialty: "Gynecologist",
          subSpecialty: "Fibroid Specialist",
          rating: 4.8,
          reviewCount: 267,
          experience: "14+ years",
          education: ["MBChB - University of Nairobi", "Fellowship in Gynecological Surgery"],
          languages: ["English", "Swahili", "Kikuyu"],
          availability: {
            days: ["Tuesday", "Thursday", "Saturday"],
            hours: "8:00 AM - 4:00 PM",
            nextAvailable: "2024-01-18"
          },
          consultationFee: 7000,
          hospitalId: '2'
        }
      ]
    }
  ];

  const specialties = [
    "Gynecology",
    "Obstetrics", 
    "Endocrinology",
    "Reproductive Health",
    "Fertility",
    "Maternal Health",
    "PCOS Specialist",
    "Fibroid Specialist"
  ];

  const locations = [
    "Nairobi, Kenya",
    "Mombasa, Kenya", 
    "Kisumu, Kenya",
    "Nakuru, Kenya",
    "Eldoret, Kenya"
  ];

  const priceRanges = [
    "Under KES 3,000",
    "KES 3,000 - 5,000", 
    "KES 5,000 - 8,000",
    "KES 8,000 - 12,000",
    "Above KES 12,000"
  ];

  const availabilityOptions = [
    "Available this week",
    "Available next week",
    "Available this month",
    "Any availability"
  ];

  const filteredDoctors = doctors.filter(doctor => {
    const hospital = hospitals.find(h => h.id === doctor.hospital_id);
    if (!hospital) return false;
    
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         hospital.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSpecialty = !selectedSpecialty || doctor.specialty === selectedSpecialty;
    const matchesLocation = !selectedLocation || hospital.location === selectedLocation;
    const matchesPrice = !priceRange || getPriceRange(doctor.consultation_fee || 0) === priceRange;
    
    return matchesSearch && matchesSpecialty && matchesLocation && matchesPrice;
  }).map(doctor => ({
    ...doctor,
    hospital: hospitals.find(h => h.id === doctor.hospital_id)!
  }));

  function getPriceRange(fee: number): string {
    if (fee < 3000) return "Under KES 3,000";
    if (fee < 5000) return "KES 3,000 - 5,000";
    if (fee < 8000) return "KES 5,000 - 8,000";
    if (fee < 12000) return "KES 8,000 - 12,000";
    return "Above KES 12,000";
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading specialists...</p>
        </div>
      </div>
    );
  }

  const handleBookAppointment = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setBookingStep(1);
  };

  const handleBookingSubmit = async () => {
    if (!bookingData.date || !bookingData.time || !selectedDoctor) {
      toast({
        title: "Missing Information",
        description: "Please select a date and time for your appointment.",
        variant: "destructive"
      });
      return;
    }

    try {
      const appointment = await DatabaseService.createAppointment({
        doctor_id: selectedDoctor.id,
        hospital_id: selectedDoctor.hospitalId,
        appointment_date: bookingData.date,
        appointment_time: bookingData.time,
        reason: bookingData.reason,
        notes: bookingData.notes
      });

      if (appointment) {
        const booking = {
          doctor: selectedDoctor,
          ...bookingData,
          id: appointment.id,
          status: 'pending'
        };

        onBookingComplete?.(booking);
        
        toast({
          title: "Booking Submitted",
          description: "Your appointment request has been submitted successfully.",
        });

        // Reset booking state
        setSelectedDoctor(null);
        setBookingStep(0);
        setBookingData({ date: '', time: '', reason: '', notes: '' });
      } else {
        throw new Error('Failed to create appointment');
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "Booking Error",
        description: "Failed to submit your appointment request. Please try again.",
        variant: "destructive"
      });
    }
  };

  const renderBookingForm = () => {
    if (!selectedDoctor) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle>Book Appointment</CardTitle>
          <CardDescription>
            Schedule an appointment with {selectedDoctor.name}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-semibold">{selectedDoctor.name}</h4>
              <p className="text-sm text-gray-600">{selectedDoctor.specialty}</p>
              <p className="text-sm text-gray-600">{selectedDoctor.hospital.name}</p>
            </div>
            <div className="ml-auto text-right">
              <p className="font-semibold">KES {selectedDoctor.consultationFee.toLocaleString()}</p>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm">{selectedDoctor.rating}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Preferred Date</Label>
              <Input
                id="date"
                type="date"
                value={bookingData.date}
                onChange={(e) => setBookingData(prev => ({ ...prev, date: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <Label htmlFor="time">Preferred Time</Label>
              <Select value={bookingData.time} onValueChange={(value) => setBookingData(prev => ({ ...prev, time: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="09:00">9:00 AM</SelectItem>
                  <SelectItem value="10:00">10:00 AM</SelectItem>
                  <SelectItem value="11:00">11:00 AM</SelectItem>
                  <SelectItem value="14:00">2:00 PM</SelectItem>
                  <SelectItem value="15:00">3:00 PM</SelectItem>
                  <SelectItem value="16:00">4:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="reason">Reason for Visit</Label>
            <Input
              id="reason"
              value={bookingData.reason}
              onChange={(e) => setBookingData(prev => ({ ...prev, reason: e.target.value }))}
              placeholder="Brief description of your symptoms or concerns"
            />
          </div>

          <div>
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <textarea
              id="notes"
              className="w-full p-3 border rounded-md"
              rows={3}
              value={bookingData.notes}
              onChange={(e) => setBookingData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Any additional information you'd like to share"
            />
          </div>

          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedDoctor(null);
                setBookingStep(0);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleBookingSubmit}>
              Book Appointment
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (bookingStep === 1) {
    return renderBookingForm();
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
          <Navigation className="w-8 h-8 text-blue-600" />
          Find Specialists
        </h2>
        <p className="text-gray-600">
          Connect with top specialists for {initialCondition || 'your health condition'}
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search doctors, hospitals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="specialty">Specialty</Label>
              <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                <SelectTrigger>
                  <SelectValue placeholder="All specialties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All specialties</SelectItem>
                  {specialties.map(specialty => (
                    <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="location">Location</Label>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="All locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All locations</SelectItem>
                  {locations.map(location => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="price">Price Range</Label>
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Any price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any price</SelectItem>
                  {priceRanges.map(range => (
                    <SelectItem key={range} value={range}>{range}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        {filteredDoctors.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">No doctors found matching your criteria.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSpecialty('');
                  setSelectedLocation('');
                  setPriceRange('');
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredDoctors.map((doctor) => (
            <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{doctor.name}</h3>
                      <Badge variant="secondary">{doctor.specialty}</Badge>
                      {doctor.sub_specialty && (
                        <Badge variant="outline">{doctor.sub_specialty}</Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {doctor.hospital.name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        {doctor.rating} ({doctor.review_count} reviews)
                      </span>
                      <span className="flex items-center gap-1">
                        <Award className="w-4 h-4" />
                        {doctor.experience}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-semibold mb-1">Education</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {doctor.education.map((edu, index) => (
                            <li key={index}>{edu}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Languages</h4>
                        <div className="flex flex-wrap gap-1">
                          {doctor.languages.map((lang, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                                         <div className="flex items-center gap-4 text-sm">
                       <span className="flex items-center gap-1">
                         <Calendar className="w-4 h-4" />
                         {doctor.availability_days.join(', ')}
                       </span>
                       <span className="flex items-center gap-1">
                         <Clock className="w-4 h-4" />
                         {doctor.availability_hours}
                       </span>
                       <span className="font-semibold text-green-600">
                         KES {(doctor.consultation_fee || 0).toLocaleString()}
                       </span>
                     </div>
                  </div>
                  
                  <div className="ml-6 flex flex-col gap-2">
                    <Button onClick={() => handleBookAppointment(doctor)}>
                      Book Appointment
                    </Button>
                    <Button variant="outline" size="sm">
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ReferralEngine; 