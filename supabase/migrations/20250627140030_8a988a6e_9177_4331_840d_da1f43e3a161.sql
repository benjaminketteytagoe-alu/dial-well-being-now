
-- Create symptoms_checks table
CREATE TABLE public.symptoms_checks (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  abdominal_pain boolean NOT NULL,
  irregular_periods boolean NOT NULL,
  discomfort_rating integer NOT NULL CHECK (discomfort_rating >= 1 AND discomfort_rating <= 10),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.symptoms_checks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for symptoms_checks
CREATE POLICY "Users can view their own symptom checks" 
  ON public.symptoms_checks 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own symptom checks" 
  ON public.symptoms_checks 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own symptom checks" 
  ON public.symptoms_checks 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own symptom checks" 
  ON public.symptoms_checks 
  FOR DELETE 
  USING (auth.uid() = user_id);
