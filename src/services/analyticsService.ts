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
        .from('symptom_analysis')
        .select('*')
        .eq('user_id', userId);

      const symptomChecks = symptomAnalysis?.length || 0;

      // Get community engagement
      const { data: forumPosts } = await supabase
        .from('forum_posts')
        .select('*')
        .eq('user_id', userId);

      const { data: forumReplies } = await supabase
        .from('forum_replies')
        .select('*')
        .eq('user_id', userId);

      const communityEngagement = (forumPosts?.length || 0) + (forumReplies?.length || 0);

      // Get recent health metrics
      const { data: recentMetrics } = await supabase
        .from('user_health_analytics')
        .select('*')
        .eq('user_id', userId)
        .order('recorded_date', { ascending: false })
        .limit(10);

      // Get health trends
      const { data: trends } = await supabase
        .from('health_trends')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);

      // Calculate average mood (if available)
      const moodMetrics = recentMetrics?.filter(m => m.metric_type === 'mood_tracking') || [];
      const averageMood = moodMetrics.length > 0 
        ? moodMetrics.reduce((sum, m) => sum + m.metric_value, 0) / moodMetrics.length 
        : 0;

      // Calculate health score based on various metrics
      const healthScore = this.calculateHealthScore(recentMetrics || []);

      return {
        totalAppointments,
        completedAppointments,
        upcomingAppointments,
        symptomChecks,
        communityEngagement,
        averageMood: Math.round(averageMood * 10) / 10,
        healthScore,
        trends: trends || [],
        recentMetrics: recentMetrics || []
      };
    } catch (error) {
      console.error('Error getting user analytics summary:', error);
      throw error;
    }
  }

  // Get health metrics for a specific time period
  static async getHealthMetrics(
    userId: string,
    metricType: string,
    startDate: string,
    endDate: string
  ): Promise<HealthMetric[]> {
    try {
      const { data: metrics, error } = await supabase
        .from('user_health_analytics')
        .select('*')
        .eq('user_id', userId)
        .eq('metric_type', metricType)
        .gte('recorded_date', startDate)
        .lte('recorded_date', endDate)
        .order('recorded_date', { ascending: true });

      if (error) throw error;
      return metrics || [];
    } catch (error) {
      console.error('Error getting health metrics:', error);
      throw error;
    }
  }

  // Record a new health metric
  static async recordHealthMetric(
    userId: string,
    metricType: string,
    value: number,
    unit: string,
    date: string,
    notes?: string
  ): Promise<HealthMetric> {
    try {
      const { data: metric, error } = await supabase
        .from('user_health_analytics')
        .insert({
          user_id: userId,
          metric_type: metricType,
          metric_value: value,
          metric_unit: unit,
          recorded_date: date,
          notes
        })
        .select()
        .single();

      if (error) throw error;
      return metric;
    } catch (error) {
      console.error('Error recording health metric:', error);
      throw error;
    }
  }

  // Get user engagement metrics
  static async getUserEngagement(userId: string, days: number = 30): Promise<UserEngagement[]> {
    try {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const { data: engagement, error } = await supabase
        .from('user_engagement_metrics')
        .select('*')
        .eq('user_id', userId)
        .gte('metric_date', startDate)
        .lte('metric_date', endDate)
        .order('metric_date', { ascending: true });

      if (error) throw error;
      return engagement || [];
    } catch (error) {
      console.error('Error getting user engagement:', error);
      throw error;
    }
  }

  // Record user engagement
  static async recordUserEngagement(
    userId: string,
    date: string,
    engagement: Partial<UserEngagement>
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_engagement_metrics')
        .upsert({
          user_id: userId,
          metric_date: date,
          ...engagement
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error recording user engagement:', error);
      throw error;
    }
  }

  // Get health trends
  static async getHealthTrends(userId: string): Promise<HealthTrend[]> {
    try {
      const { data: trends, error } = await supabase
        .from('health_trends')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return trends || [];
    } catch (error) {
      console.error('Error getting health trends:', error);
      throw error;
    }
  }

  // Calculate health score based on metrics
  private static calculateHealthScore(metrics: HealthMetric[]): number {
    if (metrics.length === 0) return 0;

    let totalScore = 0;
    let validMetrics = 0;

    metrics.forEach(metric => {
      switch (metric.metric_type) {
        case 'mood_tracking':
          // Mood is typically 1-10 scale
          totalScore += (metric.metric_value / 10) * 100;
          validMetrics++;
          break;
        case 'sleep_quality':
          // Sleep quality is typically 1-10 scale
          totalScore += (metric.metric_value / 10) * 100;
          validMetrics++;
          break;
        case 'stress_level':
          // Stress is typically 1-10 scale, lower is better
          totalScore += ((11 - metric.metric_value) / 10) * 100;
          validMetrics++;
          break;
        case 'exercise_frequency':
          // Exercise frequency per week, 5+ is optimal
          totalScore += Math.min((metric.metric_value / 5) * 100, 100);
          validMetrics++;
          break;
        case 'medication_adherence':
          // Adherence percentage
          totalScore += metric.metric_value;
          validMetrics++;
          break;
      }
    });

    return validMetrics > 0 ? Math.round(totalScore / validMetrics) : 0;
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

      // Community engagement insights
      if (summary.communityEngagement > 0) {
        insights.push(`You've been active in the community with ${summary.communityEngagement} posts and replies.`);
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
      if (summary.averageMood > 0) {
        if (summary.averageMood >= 7) {
          insights.push("Your mood has been positive lately. Great mental health management!");
        } else if (summary.averageMood >= 5) {
          insights.push("Your mood is stable. Consider activities that boost your well-being.");
        } else {
          insights.push("Your mood has been lower than usual. Consider reaching out for support.");
        }
      }

      return insights;
    } catch (error) {
      console.error('Error generating insights:', error);
      return ["We're analyzing your data to provide personalized insights."];
    }
  }
} 