import { createClient } from '@supabase/supabase-js'

// Get environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  throw new Error('Supabase environment variables are not set.');
}

// Create and export Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)

export default supabase