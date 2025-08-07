// Common Types for the Application

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  avatar?: string;
  rating?: number;
  experience_years?: number;
  created_at: string;
  updated_at: string;
}

export interface TeleconsultationSession {
  id: string;
  patient_id: string;
  doctor_id: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  session_type: 'video' | 'audio' | 'chat';
  scheduled_time: string;
  started_at?: string;
  ended_at?: string;
  notes?: string;
  doctor?: Doctor;
  created_at: string;
  updated_at: string;
}

export interface SymptomAnalysis {
  id: string;
  user_id: string;
  symptoms: string[];
  severity: 1 | 2 | 3 | 4 | 5;
  analysis_result?: string;
  recommendations?: string[];
  created_at: string;
  updated_at: string;
}

export interface CommunityPost {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  limit: number;
  total_pages: number;
}

// Environment Variables Type
export interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
}

export interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Route Parameters Types
export interface TeleconsultationSessionParams {
  sessionId: string;
}

export interface RouteParams {
  sessionId?: string;
  userId?: string;
  postId?: string;
}