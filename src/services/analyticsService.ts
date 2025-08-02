import { supabase } from '@/integrations/supabase/client';

export interface HealthMetric {
  id: string;
  user_id: string;
  metric_type: 'symptom_frequency' | 'appointment_attendance' | 'medication_adherence' | 'mood_tracking' | 'exercise_frequency' | 'sleep_quality' | 'stress_level';
  metric_value: number;
  metric_unit: string;
  recorded_date: string;
  notes?: string;
  created_at: string;
}

export interface HealthTrend {
  id: string;
  user_id: string;
  trend_type: 'improving' | 'stable' | 'declining';
  category: string;
  description: string;
  start_date: string;
  end_date?: string;
  confidence_score: number;
  created_at: string;
}

export interface UserEngagement {
  id: string;
  user_id: string;
  metric_date: string;
  app_opens: number;
  time_spent_minutes: number;
  features_used: string[];
  community_posts: number;
  community_replies: number;
  appointments_booked: number;
  symptom_checks: number;
  created_at: string;
}

export interface AnalyticsSummary {
  totalAppointments: number;
  completedAppointments: number;
  upcomingAppointments: number;
  symptomChecks: number;
  communityEngagement: number;
  averageMood: number;
  healthScore: number;
  trends: HealthTrend[];
  recentMetrics: HealthMetric[];
}

export class AnalyticsService {
  // Get user's health analytics summary
  static async getUserAnalyticsSummary(userId: string): Promise<AnalyticsSummary> {
    try {
      // Get appointments data
      const { data: appointments } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', userId);

      const totalAppointments = appointments?.length || 0;
      const completedAppointments = appointments?.filter(a => a.status === 'completed').length || 0;
      const upcomingAppointments = appointments?.filter(a => a.status === 'scheduled').length || 0;

      // Get symptom checks
      const { data: symptomAnalysis } = await supabase
        .from('symptoms_checks')
        .select('*')
        .eq('user_id', userId);

      const symptomChecks = symptomAnalysis?.length || 0;

      // Mock data for now since community tables don't exist yet
      const communityEngagement = 0;
      const averageMood = 7.5;
      const healthScore = 75;

      return {
        totalAppointments,
        completedAppointments,
        upcomingAppointments,
        symptomChecks,
        communityEngagement,
        averageMood,
        healthScore,
        trends: [],
        recentMetrics: []
      };
    } catch (error) {
      console.error('Error getting user analytics summary:', error);
      throw error;
    }
  }

  // Generate insights based on user data
  static async generateInsights(userId: string): Promise<string[]> {
    try {
      const summary = await this.getUserAnalyticsSummary(userId);
      const insights: string[] = [];

      // Appointment insights
      if (summary.completedAppointments > 0) {
        insights.push(`You've completed ${summary.completedAppointments} appointments this year. Great job staying on top of your health!`);
      }

      if (summary.upcomingAppointments > 0) {
        insights.push(`You have ${summary.upcomingAppointments} upcoming appointments scheduled.`);
      }

      // Symptom check insights
      if (summary.symptomChecks > 0) {
        insights.push(`You've performed ${summary.symptomChecks} symptom checks, showing great health awareness.`);
      }

      // Health score insights
      if (summary.healthScore >= 80) {
        insights.push("Your overall health score is excellent! Keep up the great work.");
      } else if (summary.healthScore >= 60) {
        insights.push("Your health score is good, but there's room for improvement.");
      } else {
        insights.push("Consider focusing on improving your health habits to boost your score.");
      }

      // Mood insights
      if (summary.averageMood >= 7) {
        insights.push("Your mood has been positive lately. Great mental health management!");
      } else if (summary.averageMood >= 5) {
        insights.push("Your mood is stable. Consider activities that boost your well-being.");
      } else {
        insights.push("Your mood has been lower than usual. Consider reaching out for support.");
      }

      return insights.length > 0 ? insights : ["We're analyzing your data to provide personalized insights."];
    } catch (error) {
      console.error('Error generating insights:', error);
      return ["We're analyzing your data to provide personalized insights."];
    }
  }
}