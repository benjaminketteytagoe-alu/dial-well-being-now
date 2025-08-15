import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Activity, 
  Calendar, 
  MessageSquare, 
  Heart, 
  Target,
  BarChart3,
  LineChart,
  Users,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { AnalyticsService, AnalyticsSummary } from '@/services/analyticsService';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const UserAnalytics = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [insights, setInsights] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      loadAnalytics();
    }
  }, [user]);

  const loadAnalytics = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const analyticsSummary = await AnalyticsService.getUserAnalyticsSummary(user.id);
      const userInsights = await AnalyticsService.generateInsights(user.id);
      
      setSummary(analyticsSummary);
      setInsights(userInsights);
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast({
        title: "Error",
        description: "Failed to load your analytics data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getHealthScoreStatus = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!summary) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">No analytics data available yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Health Score Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Your Health Score</span>
          </CardTitle>
          <CardDescription>Overall health assessment based on your data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`p-4 rounded-full ${getHealthScoreBg(summary.healthScore)}`}>
                <span className={`text-3xl font-bold ${getHealthScoreColor(summary.healthScore)}`}>
                  {summary.healthScore}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Overall Score</p>
                <p className="text-lg font-semibold">out of 100</p>
                <Badge variant={summary.healthScore >= 80 ? 'default' : summary.healthScore >= 60 ? 'secondary' : 'destructive'}>
                  {getHealthScoreStatus(summary.healthScore)}
                </Badge>
              </div>
            </div>
            <Progress value={summary.healthScore} className="w-32" />
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Appointments</p>
                <p className="text-2xl font-bold">{summary.totalAppointments}</p>
                <p className="text-xs text-green-600">
                  {summary.completedAppointments} completed
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Symptom Checks</p>
                <p className="text-2xl font-bold">{summary.symptomChecks}</p>
                <p className="text-xs text-blue-600">Health monitoring</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Community</p>
                <p className="text-2xl font-bold">{summary.communityEngagement}</p>
                <p className="text-xs text-purple-600">Posts & replies</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Mood</p>
                <p className="text-2xl font-bold">{summary.averageMood}</p>
                <p className="text-xs text-red-600">Average score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trends and Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Health Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Health Trends</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {summary.trends.length > 0 ? (
              <div className="space-y-3">
                {summary.trends.slice(0, 3).map((trend) => (
                  <div key={trend.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{trend.category}</p>
                      <p className="text-sm text-gray-600">{trend.description}</p>
                    </div>
                    <Badge 
                      variant={trend.trend_type === 'improving' ? 'default' : 
                              trend.trend_type === 'stable' ? 'secondary' : 'destructive'}
                    >
                      {trend.trend_type}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No trends detected yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Personalized Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {insights.length > 0 ? (
              <div className="space-y-3">
                {insights.map((insight, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-blue-900">{insight}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Generating insights...</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Metrics Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <LineChart className="w-5 h-5" />
            <span>Recent Health Metrics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {summary.recentMetrics.length > 0 ? (
            <div className="space-y-4">
              {summary.recentMetrics.slice(0, 5).map((metric) => (
                <div key={metric.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-full">
                      <Activity className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium capitalize">{metric.metric_type.replace('_', ' ')}</p>
                      <p className="text-sm text-gray-600">{metric.recorded_date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{metric.metric_value} {metric.metric_unit}</p>
                    {metric.notes && (
                      <p className="text-xs text-gray-500">{metric.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No recent metrics recorded.</p>
          )}
        </CardContent>
      </Card>

      {/* Engagement Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Engagement Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-lg font-semibold text-green-800">{summary.completedAppointments}</p>
              <p className="text-sm text-green-600">Completed Appointments</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-lg font-semibold text-blue-800">{summary.upcomingAppointments}</p>
              <p className="text-sm text-blue-600">Upcoming Appointments</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <MessageSquare className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-lg font-semibold text-purple-800">{summary.communityEngagement}</p>
              <p className="text-sm text-purple-600">Community Interactions</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5" />
            <span>Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {summary.healthScore < 60 && (
              <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800">Focus on Health Improvement</p>
                  <p className="text-sm text-yellow-700">Your health score indicates areas for improvement. Consider scheduling regular check-ups and tracking your metrics more frequently.</p>
                </div>
              </div>
            )}
            
            {summary.communityEngagement === 0 && (
              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <Users className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-800">Join the Community</p>
                  <p className="text-sm text-blue-700">Connect with others in similar health journeys. Share experiences and get support from the community.</p>
                </div>
              </div>
            )}

            {summary.symptomChecks === 0 && (
              <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                <Activity className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-green-800">Start Symptom Tracking</p>
                  <p className="text-sm text-green-700">Regular symptom tracking helps identify patterns and improve your health management.</p>
                </div>
              </div>
            )}

            {summary.averageMood > 0 && summary.averageMood < 5 && (
              <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                <Heart className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <p className="font-medium text-red-800">Mental Health Support</p>
                  <p className="text-sm text-red-700">Your mood tracking shows lower scores. Consider reaching out for mental health support or stress management resources.</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserAnalytics; 