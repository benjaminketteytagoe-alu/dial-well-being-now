-- Create symptom_analysis table
CREATE TABLE IF NOT EXISTS public.symptom_analysis (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    symptoms TEXT[] NOT NULL,
    age INTEGER NOT NULL,
    medical_history TEXT[] DEFAULT '{}',
    current_medications TEXT[] DEFAULT '{}',
    family_history TEXT[] DEFAULT '{}',
    lifestyle_factors TEXT[] DEFAULT '{}',
    severity INTEGER NOT NULL CHECK (severity >= 1 AND severity <= 10),
    duration TEXT NOT NULL,
    ai_condition TEXT,
    ai_confidence DECIMAL(3,2),
    ai_risk_level TEXT CHECK (ai_risk_level IN ('low', 'medium', 'high')),
    ai_urgency TEXT CHECK (ai_urgency IN ('routine', 'soon', 'immediate')),
    ai_recommendations TEXT[],
    ai_explanation TEXT,
    ai_next_steps TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create hospitals table
CREATE TABLE IF NOT EXISTS public.hospitals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    specialties TEXT[] NOT NULL,
    rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
    review_count INTEGER DEFAULT 0,
    facilities TEXT[] DEFAULT '{}',
    insurance TEXT[] DEFAULT '{}',
    phone TEXT,
    email TEXT,
    website TEXT,
    availability_days TEXT[] DEFAULT '{}',
    availability_hours TEXT,
    emergency_available BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create doctors table
CREATE TABLE IF NOT EXISTS public.doctors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    hospital_id UUID REFERENCES public.hospitals(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    specialty TEXT NOT NULL,
    sub_specialty TEXT,
    rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
    review_count INTEGER DEFAULT 0,
    experience TEXT,
    education TEXT[] DEFAULT '{}',
    languages TEXT[] DEFAULT '{}',
    availability_days TEXT[] DEFAULT '{}',
    availability_hours TEXT,
    consultation_fee DECIMAL(10,2),
    next_available_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create appointments table (enhanced)
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE,
    hospital_id UUID REFERENCES public.hospitals(id) ON DELETE CASCADE,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    reason TEXT,
    notes TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_symptom_analysis_user_id ON public.symptom_analysis(user_id);
CREATE INDEX IF NOT EXISTS idx_symptom_analysis_created_at ON public.symptom_analysis(created_at);
CREATE INDEX IF NOT EXISTS idx_hospitals_location ON public.hospitals(location);
CREATE INDEX IF NOT EXISTS idx_hospitals_specialties ON public.hospitals USING GIN(specialties);
CREATE INDEX IF NOT EXISTS idx_doctors_hospital_id ON public.doctors(hospital_id);
CREATE INDEX IF NOT EXISTS idx_doctors_specialty ON public.doctors(specialty);
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON public.appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON public.appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(appointment_date);

-- Enable Row Level Security
ALTER TABLE public.symptom_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own symptom analysis" ON public.symptom_analysis
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own symptom analysis" ON public.symptom_analysis
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own symptom analysis" ON public.symptom_analysis
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view hospitals" ON public.hospitals
    FOR SELECT USING (true);

CREATE POLICY "Anyone can view doctors" ON public.doctors
    FOR SELECT USING (true);

CREATE POLICY "Users can view their own appointments" ON public.appointments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own appointments" ON public.appointments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own appointments" ON public.appointments
    FOR UPDATE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_symptom_analysis_updated_at BEFORE UPDATE ON public.symptom_analysis
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hospitals_updated_at BEFORE UPDATE ON public.hospitals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_doctors_updated_at BEFORE UPDATE ON public.doctors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for hospitals
INSERT INTO public.hospitals (name, location, specialties, rating, review_count, facilities, insurance, phone, email, website, availability_days, availability_hours, emergency_available) VALUES
('Nairobi Women''s Hospital', 'Nairobi, Kenya', ARRAY['Gynecology', 'Obstetrics', 'Reproductive Health', 'Fertility'], 4.8, 1247, ARRAY['24/7 Emergency', 'Laboratory', 'Imaging', 'Pharmacy'], ARRAY['NHIF', 'AAR', 'CIC', 'Jubilee'], '+254 20 123 4567', 'info@nwh.co.ke', 'www.nwh.co.ke', ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], '8:00 AM - 6:00 PM', true),
('Aga Khan University Hospital', 'Nairobi, Kenya', ARRAY['Endocrinology', 'Gynecology', 'Maternal Health', 'Fertility'], 4.9, 2156, ARRAY['Research Center', 'Advanced Imaging', 'Specialized Labs', 'Pharmacy'], ARRAY['NHIF', 'AAR', 'CIC', 'Jubilee', 'Allianz'], '+254 20 234 5678', 'appointments@aku.edu', 'www.aku.edu', ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], '8:00 AM - 5:00 PM', true),
('Kenyatta National Hospital', 'Nairobi, Kenya', ARRAY['Gynecology', 'Obstetrics', 'Fertility'], 4.5, 1890, ARRAY['Emergency Services', 'Laboratory', 'Imaging', 'Pharmacy'], ARRAY['NHIF', 'AAR'], '+254 20 345 6789', 'info@knh.or.ke', 'www.knh.or.ke', ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], '8:00 AM - 5:00 PM', true);

-- Insert sample data for doctors
INSERT INTO public.doctors (hospital_id, name, specialty, sub_specialty, rating, review_count, experience, education, languages, availability_days, availability_hours, consultation_fee, next_available_date) 
SELECT 
    h.id,
    'Dr. Sarah Mwangi',
    'Gynecologist',
    'PCOS Specialist',
    4.9,
    234,
    '15+ years',
    ARRAY['MBChB - University of Nairobi', 'MSc Gynecology - University of London'],
    ARRAY['English', 'Swahili', 'Kikuyu'],
    ARRAY['Monday', 'Wednesday', 'Friday'],
    '9:00 AM - 5:00 PM',
    5000.00,
    '2024-01-15'
FROM public.hospitals h WHERE h.name = 'Nairobi Women''s Hospital';

INSERT INTO public.doctors (hospital_id, name, specialty, sub_specialty, rating, review_count, experience, education, languages, availability_days, availability_hours, consultation_fee, next_available_date) 
SELECT 
    h.id,
    'Dr. James Ochieng',
    'Obstetrician',
    'High-Risk Pregnancy',
    4.7,
    189,
    '12+ years',
    ARRAY['MBChB - Moi University', 'Fellowship in Maternal-Fetal Medicine'],
    ARRAY['English', 'Swahili', 'Luo'],
    ARRAY['Tuesday', 'Thursday', 'Saturday'],
    '8:00 AM - 4:00 PM',
    6000.00,
    '2024-01-16'
FROM public.hospitals h WHERE h.name = 'Nairobi Women''s Hospital';

INSERT INTO public.doctors (hospital_id, name, specialty, sub_specialty, rating, review_count, experience, education, languages, availability_days, availability_hours, consultation_fee, next_available_date) 
SELECT 
    h.id,
    'Dr. Fatima Hassan',
    'Endocrinologist',
    'PCOS & Diabetes',
    4.9,
    312,
    '18+ years',
    ARRAY['MBChB - University of Nairobi', 'PhD Endocrinology - Harvard'],
    ARRAY['English', 'Swahili', 'Arabic'],
    ARRAY['Monday', 'Wednesday', 'Friday'],
    '9:00 AM - 5:00 PM',
    8000.00,
    '2024-01-17'
FROM public.hospitals h WHERE h.name = 'Aga Khan University Hospital';

INSERT INTO public.doctors (hospital_id, name, specialty, sub_specialty, rating, review_count, experience, education, languages, availability_days, availability_hours, consultation_fee, next_available_date) 
SELECT 
    h.id,
    'Dr. Peter Kamau',
    'Gynecologist',
    'Fibroid Specialist',
    4.8,
    267,
    '14+ years',
    ARRAY['MBChB - University of Nairobi', 'Fellowship in Gynecological Surgery'],
    ARRAY['English', 'Swahili', 'Kikuyu'],
    ARRAY['Tuesday', 'Thursday', 'Saturday'],
    '8:00 AM - 4:00 PM',
    7000.00,
    '2024-01-18'
FROM public.hospitals h WHERE h.name = 'Aga Khan University Hospital'; 