-- Create specializations table
CREATE TABLE public.specializations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create hospitals/clinics table  
CREATE TABLE public.healthcare_facilities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('hospital', 'clinic')),
  location TEXT NOT NULL,
  address TEXT,
  phone_number TEXT,
  email TEXT,
  services TEXT[],
  rating DECIMAL(2,1) DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create doctors table
CREATE TABLE public.doctors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  specialization_id UUID REFERENCES public.specializations(id),
  facility_id UUID REFERENCES public.healthcare_facilities(id),
  license_number TEXT,
  phone_number TEXT,
  email TEXT,
  years_of_experience INTEGER,
  consultation_fee DECIMAL(10,2),
  availability_schedule JSONB,
  rating DECIMAL(2,1) DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create referrals table
CREATE TABLE public.referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  symptom_analysis JSONB NOT NULL,
  recommended_specialization TEXT NOT NULL,
  facility_id UUID REFERENCES public.healthcare_facilities(id),
  doctor_id UUID REFERENCES public.doctors(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'scheduled', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.specializations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.healthcare_facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- Create policies for specializations (public read)
CREATE POLICY "Anyone can view specializations" 
ON public.specializations 
FOR SELECT 
USING (true);

-- Create policies for healthcare facilities (public read)
CREATE POLICY "Anyone can view healthcare facilities" 
ON public.healthcare_facilities 
FOR SELECT 
USING (true);

-- Create policies for doctors (public read)
CREATE POLICY "Anyone can view doctors" 
ON public.doctors 
FOR SELECT 
USING (true);

-- Create policies for referrals (user-specific)
CREATE POLICY "Users can view their own referrals" 
ON public.referrals 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own referrals" 
ON public.referrals 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own referrals" 
ON public.referrals 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Insert sample data
INSERT INTO public.specializations (name, description) VALUES
('Gynecology', 'Specialized in women''s reproductive health'),
('Endocrinology', 'Specialized in hormonal disorders including PCOS'),
('Maternal-Fetal Medicine', 'Specialized in high-risk pregnancies'),
('Reproductive Endocrinology', 'Specialized in fertility and reproductive hormones'),
('Obstetrics', 'Specialized in pregnancy and childbirth');

INSERT INTO public.healthcare_facilities (name, type, location, address, phone_number, services) VALUES
('Nairobi Women''s Hospital', 'hospital', 'Nairobi', 'Hurlingham, Nairobi', '+254-20-272-6000', ARRAY['Gynecology', 'Obstetrics', 'Fertility Treatment']),
('Aga Khan Hospital', 'hospital', 'Nairobi', 'Third Parklands Avenue, Nairobi', '+254-20-366-2000', ARRAY['Gynecology', 'Endocrinology', 'Maternal Care']),
('Gertrude''s Children''s Hospital', 'hospital', 'Nairobi', 'Muthaiga Road, Nairobi', '+254-20-272-0000', ARRAY['Pediatrics', 'Maternal Care']),
('Avenue Healthcare', 'clinic', 'Nairobi', 'Kiambu Road, Nairobi', '+254-20-444-5000', ARRAY['Gynecology', 'General Practice']);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_healthcare_facilities_updated_at
  BEFORE UPDATE ON public.healthcare_facilities
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_doctors_updated_at
  BEFORE UPDATE ON public.doctors
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_referrals_updated_at
  BEFORE UPDATE ON public.referrals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();