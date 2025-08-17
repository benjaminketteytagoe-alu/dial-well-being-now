-- Create enum for gender
CREATE TYPE public.gender_type AS ENUM ('male', 'female', 'other', 'prefer_not_to_say');

-- Create enum for signup reasons  
CREATE TYPE public.signup_reason AS ENUM (
  'reproductive_health',
  'pregnancy_tracking', 
  'fertility_planning',
  'menstrual_health',
  'general_wellness',
  'healthcare_access',
  'teleconsultation',
  'health_education',
  'other'
);

-- Add new columns to existing profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS gender gender_type,
ADD COLUMN IF NOT EXISTS signup_reason signup_reason;

-- Create unique constraint for user_id if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_user_id_key') THEN
        ALTER TABLE public.profiles ADD CONSTRAINT profiles_user_id_key UNIQUE (user_id);
    END IF;
END $$;

-- Update RLS policies to use user_id instead of id
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id OR auth.uid() = id);

CREATE POLICY "Users can create their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id OR auth.uid() = id);