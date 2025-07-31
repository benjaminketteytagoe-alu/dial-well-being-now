import { supabase } from '@/integrations/supabase/client';
import { SymptomData, AIAnalysisResult } from './aiService';

export interface SymptomAnalysisRecord {
  id: string;
  user_id: string;
  symptoms: string[];
  age: number;
  medical_history: string[];
  current_medications: string[];
  family_history: string[];
  lifestyle_factors: string[];
  severity: number;
  duration: string;
  ai_condition: string | null;
  ai_confidence: number | null;
  ai_risk_level: 'low' | 'medium' | 'high' | null;
  ai_urgency: 'routine' | 'soon' | 'immediate' | null;
  ai_recommendations: string[] | null;
  ai_explanation: string | null;
  ai_next_steps: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface HospitalRecord {
  id: string;
  name: string;
  location: string;
  specialties: string[];
  rating: number;
  review_count: number;
  facilities: string[];
  insurance: string[];
  phone: string | null;
  email: string | null;
  website: string | null;
  availability_days: string[];
  availability_hours: string | null;
  emergency_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface DoctorRecord {
  id: string;
  hospital_id: string;
  name: string;
  specialty: string;
  sub_specialty: string | null;
  rating: number;
  review_count: number;
  experience: string | null;
  education: string[];
  languages: string[];
  availability_days: string[];
  availability_hours: string | null;
  consultation_fee: number | null;
  next_available_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface AppointmentRecord {
  id: string;
  user_id: string;
  doctor_id: string;
  hospital_id: string;
  appointment_date: string;
  appointment_time: string;
  reason: string | null;
  notes: string | null;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
  updated_at: string;
}

export class DatabaseService {
  // Symptom Analysis Methods
  static async saveSymptomAnalysis(
    symptomData: SymptomData,
    analysisResult: AIAnalysisResult
  ): Promise<SymptomAnalysisRecord | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('symptom_analysis')
        .insert({
          user_id: user.id,
          symptoms: symptomData.symptoms,
          age: symptomData.age,
          medical_history: symptomData.medicalHistory,
          current_medications: symptomData.currentMedications,
          family_history: symptomData.familyHistory,
          lifestyle_factors: symptomData.lifestyleFactors,
          severity: symptomData.severity,
          duration: symptomData.duration,
          ai_condition: analysisResult.condition,
          ai_confidence: analysisResult.confidence,
          ai_risk_level: analysisResult.riskLevel,
          ai_urgency: analysisResult.urgency,
          ai_recommendations: analysisResult.recommendations,
          ai_explanation: analysisResult.explanation,
          ai_next_steps: analysisResult.nextSteps,
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving symptom analysis:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in saveSymptomAnalysis:', error);
      return null;
    }
  }

  static async getUserSymptomHistory(): Promise<SymptomAnalysisRecord[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('symptom_analysis')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching symptom history:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUserSymptomHistory:', error);
      return [];
    }
  }

  // Hospital Methods
  static async getHospitals(): Promise<HospitalRecord[]> {
    try {
      const { data, error } = await supabase
        .from('hospitals')
        .select('*')
        .order('rating', { ascending: false });

      if (error) {
        console.error('Error fetching hospitals:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getHospitals:', error);
      return [];
    }
  }

  static async getHospitalsBySpecialty(specialty: string): Promise<HospitalRecord[]> {
    try {
      const { data, error } = await supabase
        .from('hospitals')
        .select('*')
        .contains('specialties', [specialty])
        .order('rating', { ascending: false });

      if (error) {
        console.error('Error fetching hospitals by specialty:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getHospitalsBySpecialty:', error);
      return [];
    }
  }

  // Doctor Methods
  static async getDoctors(): Promise<DoctorRecord[]> {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .order('rating', { ascending: false });

      if (error) {
        console.error('Error fetching doctors:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getDoctors:', error);
      return [];
    }
  }

  static async getDoctorsBySpecialty(specialty: string): Promise<DoctorRecord[]> {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('specialty', specialty)
        .order('rating', { ascending: false });

      if (error) {
        console.error('Error fetching doctors by specialty:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getDoctorsBySpecialty:', error);
      return [];
    }
  }

  static async getDoctorsByHospital(hospitalId: string): Promise<DoctorRecord[]> {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('hospital_id', hospitalId)
        .order('rating', { ascending: false });

      if (error) {
        console.error('Error fetching doctors by hospital:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getDoctorsByHospital:', error);
      return [];
    }
  }

  static async getDoctorWithHospital(doctorId: string): Promise<{ doctor: DoctorRecord; hospital: HospitalRecord } | null> {
    try {
      const { data: doctor, error: doctorError } = await supabase
        .from('doctors')
        .select('*')
        .eq('id', doctorId)
        .single();

      if (doctorError || !doctor) {
        console.error('Error fetching doctor:', doctorError);
        return null;
      }

      const { data: hospital, error: hospitalError } = await supabase
        .from('hospitals')
        .select('*')
        .eq('id', doctor.hospital_id)
        .single();

      if (hospitalError || !hospital) {
        console.error('Error fetching hospital:', hospitalError);
        return null;
      }

      return { doctor, hospital };
    } catch (error) {
      console.error('Error in getDoctorWithHospital:', error);
      return null;
    }
  }

  // Appointment Methods
  static async createAppointment(appointmentData: {
    doctor_id: string;
    hospital_id: string;
    appointment_date: string;
    appointment_time: string;
    reason?: string;
    notes?: string;
  }): Promise<AppointmentRecord | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('appointments')
        .insert({
          user_id: user.id,
          ...appointmentData,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating appointment:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in createAppointment:', error);
      return null;
    }
  }

  static async getUserAppointments(): Promise<AppointmentRecord[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', user.id)
        .order('appointment_date', { ascending: true });

      if (error) {
        console.error('Error fetching user appointments:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUserAppointments:', error);
      return [];
    }
  }

  static async updateAppointmentStatus(
    appointmentId: string,
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', appointmentId);

      if (error) {
        console.error('Error updating appointment status:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateAppointmentStatus:', error);
      return false;
    }
  }

  // Search Methods
  static async searchDoctors(searchParams: {
    specialty?: string;
    location?: string;
    maxPrice?: number;
    availability?: string;
  }): Promise<DoctorRecord[]> {
    try {
      let query = supabase
        .from('doctors')
        .select(`
          *,
          hospitals (
            name,
            location,
            specialties
          )
        `);

      if (searchParams.specialty) {
        query = query.eq('specialty', searchParams.specialty);
      }

      if (searchParams.maxPrice) {
        query = query.lte('consultation_fee', searchParams.maxPrice);
      }

      if (searchParams.location) {
        query = query.eq('hospitals.location', searchParams.location);
      }

      const { data, error } = await query.order('rating', { ascending: false });

      if (error) {
        console.error('Error searching doctors:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in searchDoctors:', error);
      return [];
    }
  }

  // Analytics Methods
  static async getSymptomAnalytics(): Promise<{
    totalAssessments: number;
    mostCommonConditions: Array<{ condition: string; count: number }>;
    averageConfidence: number;
  }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('symptom_analysis')
        .select('ai_condition, ai_confidence')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching symptom analytics:', error);
        return {
          totalAssessments: 0,
          mostCommonConditions: [],
          averageConfidence: 0,
        };
      }

      const totalAssessments = data?.length || 0;
      const conditions = data?.map(item => item.ai_condition).filter(Boolean) || [];
      const conditionCounts = conditions.reduce((acc, condition) => {
        acc[condition!] = (acc[condition!] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const mostCommonConditions = Object.entries(conditionCounts)
        .map(([condition, count]) => ({ condition, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      const confidences = data?.map(item => item.ai_confidence).filter(Boolean) || [];
      const averageConfidence = confidences.length > 0 
        ? confidences.reduce((sum, conf) => sum + (conf || 0), 0) / confidences.length 
        : 0;

      return {
        totalAssessments,
        mostCommonConditions,
        averageConfidence,
      };
    } catch (error) {
      console.error('Error in getSymptomAnalytics:', error);
      return {
        totalAssessments: 0,
        mostCommonConditions: [],
        averageConfidence: 0,
      };
    }
  }
} 