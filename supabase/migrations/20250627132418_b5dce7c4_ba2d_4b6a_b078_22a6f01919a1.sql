
-- Create a profiles table for additional user information
CREATE TABLE public.profiles (
  id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name text,
  phone_number text,
  date_of_birth date,
  location text,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create appointments table
CREATE TABLE public.appointments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  doctor_name text NOT NULL,
  appointment_date date NOT NULL,
  appointment_time time NOT NULL,
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  notes text,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Create RLS policies for appointments
CREATE POLICY "Users can view their own appointments" 
  ON public.appointments 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own appointments" 
  ON public.appointments 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own appointments" 
  ON public.appointments 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own appointments" 
  ON public.appointments 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  RETURN NEW;
END;
$$;

-- Create trigger for new user profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create storage bucket for user files
INSERT INTO storage.buckets (id, name, public) VALUES ('user-files', 'user-files', true);

-- Create storage policies
CREATE POLICY "Users can upload their own files" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'user-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own files" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'user-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own files" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'user-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own files" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'user-files' AND auth.uid()::text = (storage.foldername(name))[1]);
