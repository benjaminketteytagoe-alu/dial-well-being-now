-- Create teleconsultation sessions table
CREATE TABLE IF NOT EXISTS public.teleconsultation_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE,
    session_type TEXT NOT NULL CHECK (session_type IN ('video', 'audio', 'chat')),
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in-progress', 'completed', 'cancelled', 'no-show')),
    scheduled_start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    scheduled_end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    actual_start_time TIMESTAMP WITH TIME ZONE,
    actual_end_time TIMESTAMP WITH TIME ZONE,
    session_duration_minutes INTEGER,
    meeting_url TEXT,
    meeting_id TEXT,
    session_notes TEXT,
    prescription_notes TEXT,
    follow_up_required BOOLEAN DEFAULT false,
    follow_up_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create teleconsultation session logs table (for audit purposes, no recording data)
CREATE TABLE IF NOT EXISTS public.teleconsultation_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID REFERENCES public.teleconsultation_sessions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL CHECK (event_type IN ('session_started', 'session_ended', 'prescription_given', 'follow_up_scheduled', 'session_cancelled')),
    event_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    event_details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create teleconsultation availability table
CREATE TABLE IF NOT EXISTS public.doctor_teleconsultation_availability (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 1=Monday, etc.
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    session_duration_minutes INTEGER DEFAULT 30,
    max_sessions_per_day INTEGER DEFAULT 8,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_teleconsultation_sessions_user_id ON public.teleconsultation_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_teleconsultation_sessions_doctor_id ON public.teleconsultation_sessions(doctor_id);
CREATE INDEX IF NOT EXISTS idx_teleconsultation_sessions_status ON public.teleconsultation_sessions(status);
CREATE INDEX IF NOT EXISTS idx_teleconsultation_sessions_scheduled_start ON public.teleconsultation_sessions(scheduled_start_time);
CREATE INDEX IF NOT EXISTS idx_teleconsultation_logs_session_id ON public.teleconsultation_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_doctor_teleconsultation_availability_doctor_id ON public.doctor_teleconsultation_availability(doctor_id);

-- Enable Row Level Security
ALTER TABLE public.teleconsultation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teleconsultation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_teleconsultation_availability ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for teleconsultation_sessions
CREATE POLICY "Users can view their own teleconsultation sessions" 
ON public.teleconsultation_sessions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own teleconsultation sessions" 
ON public.teleconsultation_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own teleconsultation sessions" 
ON public.teleconsultation_sessions 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for teleconsultation_logs
CREATE POLICY "Users can view their own teleconsultation logs" 
ON public.teleconsultation_logs 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own teleconsultation logs" 
ON public.teleconsultation_logs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for doctor_teleconsultation_availability (public read)
CREATE POLICY "Anyone can view doctor teleconsultation availability" 
ON public.doctor_teleconsultation_availability 
FOR SELECT 
USING (true);

-- Create triggers for updated_at
CREATE TRIGGER update_teleconsultation_sessions_updated_at 
    BEFORE UPDATE ON public.teleconsultation_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_doctor_teleconsultation_availability_updated_at 
    BEFORE UPDATE ON public.doctor_teleconsultation_availability
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample teleconsultation availability data
INSERT INTO public.doctor_teleconsultation_availability (doctor_id, day_of_week, start_time, end_time, session_duration_minutes, max_sessions_per_day)
SELECT 
    d.id,
    generate_series(1, 5) as day_of_week, -- Monday to Friday
    '09:00:00'::time as start_time,
    '17:00:00'::time as end_time,
    30 as session_duration_minutes,
    8 as max_sessions_per_day
FROM public.doctors d
WHERE d.specialty IN ('Gynecologist', 'Endocrinologist', 'Obstetrician'); 