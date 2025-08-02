import { supabase } from '@/integrations/supabase/client';

export interface SymptomData {
  symptoms: string[];
  age: number;
  medicalHistory: string[];
  currentMedications: string[];
  familyHistory: string[];
  lifestyleFactors: string[];
  severity: number;
  duration: string;
}

export interface AIAnalysisResult {
  condition: string;
  confidence: number;
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
  urgency: 'routine' | 'soon' | 'immediate';
  explanation: string;
  nextSteps: string[];
}

export interface ReferralRecommendation {
  specialty: string;
  hospitalName: string;
  doctorName: string;
  location: string;
  rating: number;
  availability: string;
  contactInfo: string;
  reason: string;
}

// Mock data for referral engine
const mockHospitals = [
  {
    name: "Nairobi Women's Hospital",
    location: "Nairobi, Kenya",
    specialties: ["Gynecology", "Obstetrics", "Reproductive Health"],
    doctors: [
      { name: "Dr. Sarah Mwangi", specialty: "Gynecologist", rating: 4.8, availability: "Mon-Fri" },
      { name: "Dr. James Ochieng", specialty: "Obstetrician", rating: 4.6, availability: "Mon-Sat" }
    ]
  },
  {
    name: "Aga Khan University Hospital",
    location: "Nairobi, Kenya", 
    specialties: ["Endocrinology", "Gynecology", "Maternal Health"],
    doctors: [
      { name: "Dr. Fatima Hassan", specialty: "Endocrinologist", rating: 4.9, availability: "Mon-Fri" },
      { name: "Dr. Peter Kamau", specialty: "Gynecologist", rating: 4.7, availability: "Mon-Sat" }
    ]
  },
  {
    name: "Kenyatta National Hospital",
    location: "Nairobi, Kenya",
    specialties: ["Gynecology", "Obstetrics", "Fertility"],
    doctors: [
      { name: "Dr. Grace Wanjiku", specialty: "Gynecologist", rating: 4.5, availability: "Mon-Fri" },
      { name: "Dr. Michael Odhiambo", specialty: "Obstetrician", rating: 4.4, availability: "Mon-Sat" }
    ]
  }
];

export class AISymptomChecker {
  private static async analyzeSymptomsWithAI(symptomData: SymptomData): Promise<AIAnalysisResult> {
    try {
      // Use Supabase Edge Function for AI analysis
      const { data, error } = await supabase.functions.invoke('ai-symptom-analysis', {
        body: {
          symptoms: symptomData.symptoms.join(', '),
          age: symptomData.age,
          medicalHistory: symptomData.medicalHistory.join(', '),
          currentMedications: symptomData.currentMedications.join(', ')
        }
      });

      if (error) throw error;
      
      return {
        condition: data.potentialConditions?.[0] || 'General Health Concern',
        confidence: 0.8,
        riskLevel: data.riskAssessment === 'High' ? 'high' : data.riskAssessment === 'Low' ? 'low' : 'medium',
        recommendations: data.recommendations || [],
        urgency: data.urgency === 'Urgent' ? 'immediate' : data.urgency === 'Soon' ? 'soon' : 'routine',
        explanation: data.keyFindings?.join('. ') || 'Analysis completed',
        nextSteps: data.recommendations || []
      };
    } catch (error) {
      console.error('AI analysis error:', error);
      return this.fallbackAnalysis(symptomData);
    }
  }

  private static fallbackAnalysis(symptomData: SymptomData): AIAnalysisResult {
    const symptoms = symptomData.symptoms.map(s => s.toLowerCase());
    
    let condition = "General Health Concern";
    let confidence = 0.6;
    let riskLevel: 'low' | 'medium' | 'high' = 'medium';
    let urgency: 'routine' | 'soon' | 'immediate' = 'soon';

    // PCOS indicators
    if (symptoms.some(s => s.includes('irregular') || s.includes('period')) && 
        symptoms.some(s => s.includes('weight') || s.includes('acne'))) {
      condition = "Potential PCOS";
      confidence = 0.7;
      riskLevel = 'medium';
    }

    // Fibroid indicators
    if (symptoms.some(s => s.includes('heavy') || s.includes('bleeding')) && 
        symptoms.some(s => s.includes('pelvic') || s.includes('pain'))) {
      condition = "Potential Fibroids";
      confidence = 0.8;
      riskLevel = 'high';
      urgency = 'soon';
    }

    // Maternal health
    if (symptoms.some(s => s.includes('pregnancy') || s.includes('fertility'))) {
      condition = "Maternal Health Concern";
      confidence = 0.75;
      riskLevel = 'medium';
    }

    return {
      condition,
      confidence,
      riskLevel,
      recommendations: [
        "Schedule an appointment with a gynecologist",
        "Keep a symptom diary",
        "Consider lifestyle modifications"
      ],
      urgency,
      explanation: "Based on your symptoms, we recommend consulting with a healthcare professional for proper evaluation and diagnosis.",
      nextSteps: [
        "Book an appointment with a specialist",
        "Prepare questions for your doctor",
        "Gather your medical history"
      ]
    };
  }

  public static async analyzeSymptoms(symptomData: SymptomData): Promise<AIAnalysisResult> {
    const result = await this.analyzeSymptomsWithAI(symptomData);
    
    // Save to database if user is authenticated
    try {
      const { DatabaseService } = await import('./databaseService');
      await DatabaseService.saveSymptomAnalysis(symptomData, result);
    } catch (error) {
      console.warn('Failed to save analysis to database:', error);
    }
    
    return result;
  }

  public static getReferralRecommendations(analysis: AIAnalysisResult): ReferralRecommendation[] {
    const recommendations: ReferralRecommendation[] = [];
    
    // Filter hospitals based on condition
    const relevantHospitals = mockHospitals.filter(hospital => {
      if (analysis.condition.includes('PCOS')) {
        return hospital.specialties.includes('Endocrinology') || hospital.specialties.includes('Gynecology');
      } else if (analysis.condition.includes('Fibroids')) {
        return hospital.specialties.includes('Gynecology');
      } else if (analysis.condition.includes('Maternal')) {
        return hospital.specialties.includes('Obstetrics') || hospital.specialties.includes('Maternal Health');
      }
      return true;
    });

    // Generate recommendations
    relevantHospitals.forEach(hospital => {
      hospital.doctors.forEach(doctor => {
        recommendations.push({
          specialty: doctor.specialty,
          hospitalName: hospital.name,
          doctorName: doctor.name,
          location: hospital.location,
          rating: doctor.rating,
          availability: doctor.availability,
          contactInfo: `+254 XXX XXX XXX`,
          reason: `Specialized in ${doctor.specialty} and highly rated for ${analysis.condition.toLowerCase()} treatment`
        });
      });
    });

    return recommendations
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);
  }
}