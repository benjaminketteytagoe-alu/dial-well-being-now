-- Create user health analytics table
CREATE TABLE IF NOT EXISTS public.user_health_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    metric_type TEXT NOT NULL CHECK (metric_type IN ('symptom_frequency', 'appointment_attendance', 'medication_adherence', 'mood_tracking', 'exercise_frequency', 'sleep_quality', 'stress_level')),
    metric_value DECIMAL(10,2),
    metric_unit TEXT,
    recorded_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create health trends table
CREATE TABLE IF NOT EXISTS public.health_trends (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    trend_type TEXT NOT NULL CHECK (trend_type IN ('improving', 'stable', 'declining')),
    category TEXT NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create community forums table
CREATE TABLE IF NOT EXISTS public.community_forums (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('pcos', 'fibroids', 'maternal_health', 'general_wellness', 'mental_health', 'nutrition', 'exercise')),
    is_peer_led BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    member_count INTEGER DEFAULT 0,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create forum posts table
CREATE TABLE IF NOT EXISTS public.forum_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    forum_id UUID REFERENCES public.community_forums(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    post_type TEXT DEFAULT 'discussion' CHECK (post_type IN ('discussion', 'question', 'experience', 'resource', 'announcement')),
    is_anonymous BOOLEAN DEFAULT false,
    likes_count INTEGER DEFAULT 0,
    replies_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    is_pinned BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create forum replies table
CREATE TABLE IF NOT EXISTS public.forum_replies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES public.forum_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_anonymous BOOLEAN DEFAULT false,
    likes_count INTEGER DEFAULT 0,
    is_approved BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create mentorship programs table
CREATE TABLE IF NOT EXISTS public.mentorship_programs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('pcos', 'fibroids', 'maternal_health', 'general_wellness', 'mental_health')),
    mentor_id UUID REFERENCES auth.users(id),
    max_participants INTEGER DEFAULT 10,
    current_participants INTEGER DEFAULT 0,
    duration_weeks INTEGER,
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create mentorship participants table
CREATE TABLE IF NOT EXISTS public.mentorship_participants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    program_id UUID REFERENCES public.mentorship_programs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped')),
    joined_date DATE DEFAULT CURRENT_DATE,
    completed_date DATE,
    feedback_rating INTEGER CHECK (feedback_rating >= 1 AND feedback_rating <= 5),
    feedback_comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create coaching sessions table
CREATE TABLE IF NOT EXISTS public.coaching_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    coach_id UUID REFERENCES auth.users(id),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_type TEXT NOT NULL CHECK (session_type IN ('nutrition', 'exercise', 'mental_health', 'lifestyle', 'stress_management')),
    session_date DATE NOT NULL,
    session_time TIME NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
    notes TEXT,
    goals TEXT,
    outcomes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user engagement metrics table
CREATE TABLE IF NOT EXISTS public.user_engagement_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    metric_date DATE NOT NULL,
    app_opens INTEGER DEFAULT 0,
    time_spent_minutes INTEGER DEFAULT 0,
    features_used TEXT[],
    community_posts INTEGER DEFAULT 0,
    community_replies INTEGER DEFAULT 0,
    appointments_booked INTEGER DEFAULT 0,
    symptom_checks INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_health_analytics_user_id ON public.user_health_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_user_health_analytics_metric_type ON public.user_health_analytics(metric_type);
CREATE INDEX IF NOT EXISTS idx_user_health_analytics_date ON public.user_health_analytics(recorded_date);
CREATE INDEX IF NOT EXISTS idx_health_trends_user_id ON public.health_trends(user_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_forum_id ON public.forum_posts(forum_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_user_id ON public.forum_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_forum_replies_post_id ON public.forum_replies(post_id);
CREATE INDEX IF NOT EXISTS idx_mentorship_participants_program_id ON public.mentorship_participants(program_id);
CREATE INDEX IF NOT EXISTS idx_mentorship_participants_user_id ON public.mentorship_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_coaching_sessions_user_id ON public.coaching_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_engagement_metrics_user_id ON public.user_engagement_metrics(user_id);

-- Enable Row Level Security
ALTER TABLE public.user_health_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_forums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coaching_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_engagement_metrics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own health analytics" 
ON public.user_health_analytics FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own health analytics" 
ON public.user_health_analytics FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own health trends" 
ON public.health_trends FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own health trends" 
ON public.health_trends FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view active forums" 
ON public.community_forums FOR SELECT 
USING (is_active = true);

CREATE POLICY "Users can view forum posts" 
ON public.forum_posts FOR SELECT 
USING (is_approved = true);

CREATE POLICY "Users can create forum posts" 
ON public.forum_posts FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own forum posts" 
ON public.forum_posts FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can view forum replies" 
ON public.forum_replies FOR SELECT 
USING (is_approved = true);

CREATE POLICY "Users can create forum replies" 
ON public.forum_replies FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own forum replies" 
ON public.forum_replies FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view active mentorship programs" 
ON public.mentorship_programs FOR SELECT 
USING (is_active = true);

CREATE POLICY "Users can view their own mentorship participation" 
ON public.mentorship_participants FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can join mentorship programs" 
ON public.mentorship_participants FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own coaching sessions" 
ON public.coaching_sessions FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can book coaching sessions" 
ON public.coaching_sessions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own engagement metrics" 
ON public.user_engagement_metrics FOR SELECT 
USING (auth.uid() = user_id);

-- Create triggers for updated_at
CREATE TRIGGER update_community_forums_updated_at 
    BEFORE UPDATE ON public.community_forums
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forum_posts_updated_at 
    BEFORE UPDATE ON public.forum_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forum_replies_updated_at 
    BEFORE UPDATE ON public.forum_replies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mentorship_programs_updated_at 
    BEFORE UPDATE ON public.mentorship_programs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coaching_sessions_updated_at 
    BEFORE UPDATE ON public.coaching_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample community forums
INSERT INTO public.community_forums (name, description, category, is_peer_led, member_count, created_by) VALUES
('PCOS Warriors', 'A supportive community for women managing PCOS symptoms and lifestyle changes', 'pcos', true, 1250, NULL),
('Fibroid Support Group', 'Sharing experiences and tips for managing fibroids naturally and medically', 'fibroids', true, 890, NULL),
('Maternal Health Circle', 'Support for women during pregnancy, postpartum, and maternal health challenges', 'maternal_health', true, 2100, NULL),
('Wellness Journey', 'General wellness tips, nutrition advice, and healthy lifestyle discussions', 'general_wellness', true, 1560, NULL),
('Mental Health Matters', 'Safe space for discussing mental health, stress management, and emotional well-being', 'mental_health', true, 980, NULL),
('Nutrition & Diet Support', 'Healthy eating tips, meal planning, and nutrition advice for women''s health', 'nutrition', true, 1340, NULL),
('Fitness & Exercise', 'Workout routines, exercise tips, and motivation for staying active', 'exercise', true, 1120, NULL);

-- Insert sample mentorship programs
INSERT INTO public.mentorship_programs (title, description, category, mentor_id, max_participants, current_participants, duration_weeks, start_date, end_date) VALUES
('PCOS Lifestyle Management', 'Learn to manage PCOS symptoms through diet, exercise, and stress management', 'pcos', NULL, 8, 5, 8, '2024-01-15', '2024-03-15'),
('Fibroid Natural Management', 'Natural approaches to managing fibroids and improving reproductive health', 'fibroids', NULL, 6, 3, 6, '2024-01-20', '2024-03-20'),
('Pregnancy Wellness', 'Comprehensive support for a healthy pregnancy journey', 'maternal_health', NULL, 10, 7, 12, '2024-01-10', '2024-04-10'),
('Stress Management & Mindfulness', 'Techniques for managing stress and improving mental well-being', 'mental_health', NULL, 8, 4, 6, '2024-01-25', '2024-03-25'); 