import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Star, Building, User, Calendar } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
interface Facility {
  id: string;
  name: string;
  type: 'hospital' | 'clinic';
  location: string;
  address: string;
  phone_number: string;
  services: string[];
  rating: number;
}

interface Doctor {
  id: string;
  full_name: string;
  specialization_id: string;
  facility_id: string;
  years_of_experience: number;
  consultation_fee: number;
  rating: number;
  phone_number: string;
  email: string;
}

interface Specialization {
  id: string;
  name: string;
  description: string;
}

const ReferralEngine: React.FC = () => {
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [facilityType, setFacilityType] = useState<'all' | 'hospital' | 'clinic'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSpecializations();
    fetchFacilities();
  }, []);

  useEffect(() => {
    if (selectedSpecialization) {
      fetchDoctors();
    }
  }, [selectedSpecialization, facilityType, selectedLocation]);

  const fetchSpecializations = async () => {
    try {
      const { data, error } = await supabase
        .from('specializations')
        .select('*')
        .order('name');

      if (error) throw error;
      setSpecializations(data || []);
    } catch (error) {
      console.error('Error fetching specializations:', error);
      toast({
        title: "Error",
        description: "Failed to load specializations",
        variant: "destructive",
      });
    }
  };

  const fetchFacilities = async () => {
    try {
      let query = supabase
        .from('healthcare_facilities')
        .select('*')
        .order('rating', { ascending: false });

      if (facilityType !== 'all') {
        query = query.eq('type', facilityType);
      }

      if (selectedLocation) {
        query = query.ilike('location', `%${selectedLocation}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setFacilities((data || []).map((facility: any) => ({
        ...facility,
        type: facility.type as 'hospital' | 'clinic'
      })));
    } catch (error) {
      console.error('Error fetching facilities:', error);
      toast({
        title: "Error",
        description: "Failed to load healthcare facilities",
        variant: "destructive",
      });
    }
  };

  const fetchDoctors = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('doctors')
        .select(`
          *,
          specializations (name),
          healthcare_facilities (name, location, type, address)
        `)
        .order('rating', { ascending: false });

      if (selectedSpecialization) {
        query = query.eq('specialization_id', selectedSpecialization);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      let filteredDoctors = data || [];

      // Filter by facility type and location if specified
      if (facilityType !== 'all' || selectedLocation) {
        filteredDoctors = filteredDoctors.filter(doctor => {
          const facility = doctor.healthcare_facilities;
          if (!facility) return false;
          
          if (facilityType !== 'all' && facility.type !== facilityType) {
            return false;
          }
          
          if (selectedLocation && !facility.location.toLowerCase().includes(selectedLocation.toLowerCase())) {
            return false;
          }
          
          return true;
        });
      }

      setDoctors(filteredDoctors);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast({
        title: "Error",
        description: "Failed to load doctors",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateReferral = async (doctorId: string, facilityId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to create a referral",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('referrals')
        .insert({
          user_id: user.id,
          symptom_analysis: {
            specialization: selectedSpecialization,
            location: selectedLocation,
            created_at: new Date().toISOString()
          },
          recommended_specialization: specializations.find(s => s.id === selectedSpecialization)?.name || '',
          facility_id: facilityId,
          doctor_id: doctorId,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Referral Created",
        description: "Your referral has been created successfully. The facility will contact you soon.",
      });

    } catch (error) {
      console.error('Error creating referral:', error);
      toast({
        title: "Error",
        description: "Failed to create referral",
        variant: "destructive",
      });
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-brand-dark">Healthcare Referral Engine</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Find specialized healthcare facilities and doctors for your specific needs
        </p>
      </div>

      <Card className="border-brand-accent/20">
        <CardHeader>
          <CardTitle>Search Criteria</CardTitle>
          <CardDescription>
            Filter healthcare providers by specialization, location, and facility type
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Specialization</Label>
              <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
                <SelectTrigger>
                  <SelectValue placeholder="Select specialization" />
                </SelectTrigger>
                <SelectContent>
                  {specializations.map((spec) => (
                    <SelectItem key={spec.id} value={spec.id}>
                      {spec.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                placeholder="Enter city or area"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Facility Type</Label>
              <Select value={facilityType} onValueChange={(value: 'all' | 'hospital' | 'clinic') => setFacilityType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Facilities</SelectItem>
                  <SelectItem value="hospital">Hospitals</SelectItem>
                  <SelectItem value="clinic">Clinics</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={() => { fetchFacilities(); fetchDoctors(); }}
            className="w-full bg-brand-primary hover:bg-brand-secondary text-white"
          >
            Search Healthcare Providers
          </Button>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading healthcare providers...</p>
        </div>
      )}

      {/* Healthcare Facilities */}
      {facilities.length > 0 && (
        <Card className="border-brand-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-brand-primary" />
              Healthcare Facilities ({facilities.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {facilities.map((facility) => (
                <Card key={facility.id} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-brand-dark">{facility.name}</h3>
                          <Badge variant={facility.type === 'hospital' ? 'default' : 'secondary'}>
                            {facility.type.charAt(0).toUpperCase() + facility.type.slice(1)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          {renderStars(Math.round(facility.rating))}
                          <span className="text-sm text-muted-foreground ml-1">
                            ({facility.rating.toFixed(1)})
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-brand-primary" />
                          <span>{facility.address || facility.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-brand-primary" />
                          <span>{facility.phone_number}</span>
                        </div>
                      </div>

                      {facility.services.length > 0 && (
                        <div className="space-y-2">
                          <Label className="text-xs">Services:</Label>
                          <div className="flex flex-wrap gap-1">
                            {facility.services.slice(0, 3).map((service, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                            {facility.services.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{facility.services.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Doctors */}
      {doctors.length > 0 && (
        <Card className="border-brand-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-brand-primary" />
              Available Doctors ({doctors.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctors.map((doctor) => (
                <Card key={doctor.id} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="text-center space-y-2">
                        <h3 className="font-semibold text-brand-dark">{doctor.full_name}</h3>
                        <Badge className="bg-brand-light text-brand-dark">
                          {doctor.specialization_id || 'General'}
                        </Badge>
                        <div className="flex items-center justify-center gap-1">
                          {renderStars(Math.round(doctor.rating))}
                          <span className="text-sm text-muted-foreground ml-1">
                            ({doctor.rating.toFixed(1)})
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-brand-primary" />
                          <span className="truncate">Healthcare Facility</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-brand-primary" />
                          <span>Location</span>
                        </div>
                        {doctor.years_of_experience && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-brand-primary" />
                            <span>{doctor.years_of_experience} years experience</span>
                          </div>
                        )}
                        {doctor.consultation_fee && (
                          <div className="text-center">
                            <span className="font-medium text-brand-primary">
                              KSh {doctor.consultation_fee.toLocaleString()}
                            </span>
                            <span className="text-muted-foreground"> consultation</span>
                          </div>
                        )}
                      </div>

                      <Button 
                        onClick={() => handleCreateReferral(doctor.id, doctor.facility_id)}
                        className="w-full bg-brand-primary hover:bg-brand-secondary text-white"
                        size="sm"
                      >
                        Book Consultation
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {!isLoading && selectedSpecialization && doctors.length === 0 && (
        <Card className="border-brand-accent/20">
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              No doctors found for the selected criteria. Try adjusting your search filters.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReferralEngine;