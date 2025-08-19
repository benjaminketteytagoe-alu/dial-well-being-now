import { createClient } from '@supabase/supabase-js'

// Get environment variables - using placeholder values for development
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://mhzqtqierthyuznwbjoc.supabase.co" || 'https://placeholder.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oenF0cWllcnRoeXV6bndiam9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMjQzNDQsImV4cCI6MjA2NjYwMDM0NH0.7a85hGuAj4_QyGPqkdrZBNT94MckCk3MsnOpdxyZD5U" || 'placeholder_key';

// Create and export Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;