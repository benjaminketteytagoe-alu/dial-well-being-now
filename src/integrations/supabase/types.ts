export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string
          appointment_time: string
          created_at: string
          doctor_name: string
          id: string
          notes: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          appointment_date: string
          appointment_time: string
          created_at?: string
          doctor_name: string
          id?: string
          notes?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          created_at?: string
          doctor_name?: string
          id?: string
          notes?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      doctors: {
        Row: {
          availability_schedule: Json | null
          consultation_fee: number | null
          created_at: string
          email: string | null
          facility_id: string | null
          full_name: string
          id: string
          license_number: string | null
          phone_number: string | null
          rating: number | null
          specialization_id: string | null
          updated_at: string
          years_of_experience: number | null
        }
        Insert: {
          availability_schedule?: Json | null
          consultation_fee?: number | null
          created_at?: string
          email?: string | null
          facility_id?: string | null
          full_name: string
          id?: string
          license_number?: string | null
          phone_number?: string | null
          rating?: number | null
          specialization_id?: string | null
          updated_at?: string
          years_of_experience?: number | null
        }
        Update: {
          availability_schedule?: Json | null
          consultation_fee?: number | null
          created_at?: string
          email?: string | null
          facility_id?: string | null
          full_name?: string
          id?: string
          license_number?: string | null
          phone_number?: string | null
          rating?: number | null
          specialization_id?: string | null
          updated_at?: string
          years_of_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "doctors_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "healthcare_facilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "doctors_specialization_id_fkey"
            columns: ["specialization_id"]
            isOneToOne: false
            referencedRelation: "specializations"
            referencedColumns: ["id"]
          },
        ]
      }
      healthcare_facilities: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          id: string
          location: string
          name: string
          phone_number: string | null
          rating: number | null
          services: string[] | null
          type: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          location: string
          name: string
          phone_number?: string | null
          rating?: number | null
          services?: string[] | null
          type: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          location?: string
          name?: string
          phone_number?: string | null
          rating?: number | null
          services?: string[] | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          date_of_birth: string | null
          full_name: string | null
          gender: Database["public"]["Enums"]["gender_type"] | null
          id: string
          location: string | null
          phone_number: string | null
          signup_reason: Database["public"]["Enums"]["signup_reason"] | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          date_of_birth?: string | null
          full_name?: string | null
          gender?: Database["public"]["Enums"]["gender_type"] | null
          id: string
          location?: string | null
          phone_number?: string | null
          signup_reason?: Database["public"]["Enums"]["signup_reason"] | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          date_of_birth?: string | null
          full_name?: string | null
          gender?: Database["public"]["Enums"]["gender_type"] | null
          id?: string
          location?: string | null
          phone_number?: string | null
          signup_reason?: Database["public"]["Enums"]["signup_reason"] | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      referrals: {
        Row: {
          created_at: string
          doctor_id: string | null
          facility_id: string | null
          id: string
          notes: string | null
          recommended_specialization: string
          status: string
          symptom_analysis: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          doctor_id?: string | null
          facility_id?: string | null
          id?: string
          notes?: string | null
          recommended_specialization: string
          status?: string
          symptom_analysis: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          doctor_id?: string | null
          facility_id?: string | null
          id?: string
          notes?: string | null
          recommended_specialization?: string
          status?: string
          symptom_analysis?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "referrals_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "healthcare_facilities"
            referencedColumns: ["id"]
          },
        ]
      }
      specializations: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      symptoms_checks: {
        Row: {
          abdominal_pain: boolean
          created_at: string
          discomfort_rating: number
          id: string
          irregular_periods: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          abdominal_pain: boolean
          created_at?: string
          discomfort_rating: number
          id?: string
          irregular_periods: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          abdominal_pain?: boolean
          created_at?: string
          discomfort_rating?: number
          id?: string
          irregular_periods?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      gender_type: "male" | "female" | "other" | "prefer_not_to_say"
      signup_reason:
        | "reproductive_health"
        | "pregnancy_tracking"
        | "fertility_planning"
        | "menstrual_health"
        | "general_wellness"
        | "healthcare_access"
        | "teleconsultation"
        | "health_education"
        | "other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      gender_type: ["male", "female", "other", "prefer_not_to_say"],
      signup_reason: [
        "reproductive_health",
        "pregnancy_tracking",
        "fertility_planning",
        "menstrual_health",
        "general_wellness",
        "healthcare_access",
        "teleconsultation",
        "health_education",
        "other",
      ],
    },
  },
} as const
