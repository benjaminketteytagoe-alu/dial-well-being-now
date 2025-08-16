import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Heart, 
  Activity, 
  Droplets, 
  Pill, 
  Calendar, 
  CheckCircle2, 
  Clock,
  TrendingUp,
  Target,
  Bell
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface HealthTask {
  id: string;
  title: string;
  description: string;
  category: 'medication' | 'exercise' | 'hydration' | 'nutrition' | 'checkup';
  priority: 'low' | 'medium' | 'high';
  frequency: 'daily' | 'weekly' | 'monthly';
  time_of_day: string | null;
  is_completed: boolean;
  due_date: string;
  reminder_enabled: boolean;
}

interface HealthGoal {
  id: string;
  title: string;
  description: string;
  target_value: number;
  current_value: number;
  unit: string;
  category: string;
  target_date: string;
}

const PersonalizedHealthPlan = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<HealthTask[]>([]);
  const [goals, setGoals] = useState<HealthGoal[]>([]);
  const [loading, setLoading] = useState(false);
  const [streakCount, setStreakCount] = useState(0);

  useEffect(() => {
    if (user) {
      loadHealthPlan();
      loadHealthGoals();
      calculateStreak();
    }
  }, [user]);

  const loadHealthPlan = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Mock data for now - in production this would be AI-generated based on user's health profile
      const mockTasks: HealthTask[] = [
        {
          id: '1',
          title: 'Take Iron Supplement',
          description: 'Daily iron supplement for anemia management',
          category: 'medication',
          priority: 'high',
          frequency: 'daily',
          time_of_day: '08:00',
          is_completed: false,
          due_date: new Date().toISOString().split('T')[0],
          reminder_enabled: true
        },
        {
          id: '2',
          title: 'Morning Walk',
          description: '30-minute walk for cardiovascular health',
          category: 'exercise',
          priority: 'medium',
          frequency: 'daily',
          time_of_day: '07:00',
          is_completed: false,
          due_date: new Date().toISOString().split('T')[0],
          reminder_enabled: true
        },
        {
          id: '3',
          title: 'Drink Water',
          description: 'Stay hydrated with 8 glasses of water',
          category: 'hydration',
          priority: 'medium',
          frequency: 'daily',
          time_of_day: null,
          is_completed: false,
          due_date: new Date().toISOString().split('T')[0],
          reminder_enabled: true
        },
        {
          id: '4',
          title: 'PCOS Check-up',
          description: 'Monthly gynecologist appointment',
          category: 'checkup',
          priority: 'high',
          frequency: 'monthly',
          time_of_day: null, // Add this line
          is_completed: false,
          due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          reminder_enabled: true
        }
      ];

      setTasks(mockTasks);
    } catch (error) {
      console.error('Error loading health plan:', error);
      toast({
        title: 'Error',
        description: 'Failed to load health plan.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadHealthGoals = async () => {
    if (!user) return;

    try {
      // Mock goals data
      const mockGoals: HealthGoal[] = [
        {
          id: '1',
          title: 'Weight Management',
          description: 'Maintain healthy weight for PCOS management',
          target_value: 65,
          current_value: 68,
          unit: 'kg',
          category: 'weight',
          target_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        },
        {
          id: '2',
          title: 'Daily Steps',
          description: 'Increase daily activity level',
          target_value: 10000,
          current_value: 7500,
          unit: 'steps',
          category: 'exercise',
          target_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        },
        {
          id: '3',
          title: 'Water Intake',
          description: 'Maintain proper hydration',
          target_value: 8,
          current_value: 6,
          unit: 'glasses',
          category: 'hydration',
          target_date: new Date().toISOString().split('T')[0]
        }
      ];

      setGoals(mockGoals);
    } catch (error) {
      console.error('Error loading health goals:', error);
    }
  };

  const calculateStreak = () => {
    // Mock streak calculation
    setStreakCount(5);
  };

  const toggleTaskCompletion = async (taskId: string) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId 
        ? { ...task, is_completed: !task.is_completed }
        : task
    );
    
    setTasks(updatedTasks);
    
    const task = updatedTasks.find(t => t.id === taskId);
    if (task?.is_completed) {
      toast({
        title: 'Well done!',
        description: `${task.title} completed.`,
      });
    }
  };

  const getTodaysTasks = () => {
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter((task: HealthTask) => task.due_date === today);
  };

  const getUpcomingTasks = () => {
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter((task: HealthTask) => task.due_date > today);
  };

  const getCompletionRate = () => {
    const todaysTasks = getTodaysTasks();
    if (todaysTasks.length === 0) return 0;
    
    const completedTasks = todaysTasks.filter(task => task.is_completed).length;
    return Math.round((completedTasks / todaysTasks.length) * 100);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'medication':
        return <Pill className="h-4 w-4" />;
      case 'exercise':
        return <Activity className="h-4 w-4" />;
      case 'hydration':
        return <Droplets className="h-4 w-4" />;
      case 'checkup':
        return <Calendar className="h-4 w-4" />;
      default:
        return <Heart className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
            <Target className="h-8 w-8 text-green-500" />
            Personalized Health Plan
          </h1>
          <p className="text-gray-600">AI-generated plan tailored to your health needs</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Today's Progress</p>
                  <p className="text-2xl font-bold text-green-600">{getCompletionRate()}%</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Current Streak</p>
                  <p className="text-2xl font-bold text-orange-600">{streakCount} days</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tasks Today</p>
                  <p className="text-2xl font-bold text-blue-600">{getTodaysTasks().length}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Goals</p>
                  <p className="text-2xl font-bold text-purple-600">{goals.length}</p>
                </div>
                <Target className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="today" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="today">Today's Tasks</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="reminders">Reminders</TabsTrigger>
          </TabsList>

          {/* Today's Tasks */}
          <TabsContent value="today">
            <Card>
              <CardHeader>
                <CardTitle>Today's Health Tasks</CardTitle>
                <CardDescription>
                  Complete your daily health activities to maintain your wellness plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getTodaysTasks().map((task) => (
                    <div key={task.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50">
                      <Checkbox
                        checked={task.is_completed}
                        onCheckedChange={() => toggleTaskCompletion(task.id)}
                      />
                      
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(task.category)}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className={`font-medium ${task.is_completed ? 'line-through text-gray-500' : ''}`}>
                              {task.title}
                            </h3>
                            <Badge variant={getPriorityColor(task.priority)}>
                              {task.priority}
                            </Badge>
                            {task.reminder_enabled && (
                              <Bell className="h-4 w-4 text-blue-500" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{task.description}</p>
                          {task.time_of_day && (
                            <p className="text-xs text-gray-500">Recommended time: {task.time_of_day}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {getTodaysTasks().length === 0 && (
                    <div className="text-center py-8">
                      <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
                      <p className="text-gray-500">No tasks for today!</p>
                      <p className="text-gray-400 text-sm">Your personalized plan will update based on your health needs.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Upcoming Tasks */}
          <TabsContent value="upcoming">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Tasks</CardTitle>
                <CardDescription>
                  Stay prepared with your upcoming health activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getUpcomingTasks().map((task) => (
                    <div key={task.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(task.category)}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium">{task.title}</h3>
                            <Badge variant={getPriorityColor(task.priority)}>
                              {task.priority}
                            </Badge>
                            <Badge variant="outline">
                              {new Date(task.due_date).toLocaleDateString()}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{task.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {getUpcomingTasks().length === 0 && (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No upcoming tasks.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Health Goals */}
          <TabsContent value="goals">
            <Card>
              <CardHeader>
                <CardTitle>Health Goals</CardTitle>
                <CardDescription>
                  Track your progress towards your health objectives
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {goals.map((goal) => {
                    const progress = Math.min((goal.current_value / goal.target_value) * 100, 100);
                    
                    return (
                      <div key={goal.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{goal.title}</h3>
                          <Badge variant="outline">
                            {new Date(goal.target_date).toLocaleDateString()}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Progress</span>
                            <span>
                              {goal.current_value} / {goal.target_value} {goal.unit}
                            </span>
                          </div>
                          <Progress value={progress} className="h-2" />
                          <p className="text-xs text-gray-500 text-right">{Math.round(progress)}% complete</p>
                        </div>
                      </div>
                    );
                  })}

                  {goals.length === 0 && (
                    <div className="text-center py-8">
                      <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No active goals.</p>
                      <Button className="mt-2">Set Your First Goal</Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reminders Settings */}
          <TabsContent value="reminders">
            <Card>
              <CardHeader>
                <CardTitle>Reminder Settings</CardTitle>
                <CardDescription>
                  Manage your health reminders and notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Daily Task Reminders</h3>
                        <p className="text-sm text-gray-600">Get notified about your daily health tasks</p>
                      </div>
                      <Checkbox defaultChecked />
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Medication Reminders</h3>
                        <p className="text-sm text-gray-600">Never miss your medications</p>
                      </div>
                      <Checkbox defaultChecked />
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Appointment Reminders</h3>
                        <p className="text-sm text-gray-600">Get reminded about upcoming appointments</p>
                      </div>
                      <Checkbox defaultChecked />
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Goal Check-ins</h3>
                        <p className="text-sm text-gray-600">Weekly progress updates on your goals</p>
                      </div>
                      <Checkbox defaultChecked />
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">SMS Notifications</h3>
                        <p className="text-sm text-gray-600">Receive reminders via SMS (for rural access)</p>
                      </div>
                      <Checkbox />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PersonalizedHealthPlan;
