import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Heart, Calendar as CalendarIcon, TrendingUp, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CycleData {
  id: string;
  user_id: string;
  cycle_start_date: string;
  cycle_length: number;
  period_length: number;
  symptoms: string[];
  mood: string;
  flow_intensity: 'light' | 'medium' | 'heavy';
  notes?: string;
  created_at: string;
}

const MenstrualCycleTracker = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [cycles, setCycles] = useState<CycleData[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [loading, setLoading] = useState(false);
  const [currentCycle, setCurrentCycle] = useState<Partial<CycleData>>({
    cycle_length: 28,
    period_length: 5,
    symptoms: [],
    mood: 'normal',
    flow_intensity: 'medium'
  });

  const symptoms = [
    'Cramping', 'Bloating', 'Headache', 'Mood Swings', 'Fatigue',
    'Breast Tenderness', 'Acne', 'Back Pain', 'Nausea', 'Food Cravings'
  ];

  const moods = ['Happy', 'Normal', 'Anxious', 'Sad', 'Irritable', 'Energetic'];

  useEffect(() => {
    if (user) {
      loadCycleData();
    }
  }, [user]);

  const loadCycleData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('menstrual_cycles')
        .select('*')
        .eq('user_id', user.id)
        .order('cycle_start_date', { ascending: false });

      if (error) throw error;
      setCycles(data || []);
    } catch (error) {
      console.error('Error loading cycle data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load cycle data.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const saveCycleData = async () => {
    if (!user || !selectedDate) return;

    setLoading(true);
    try {
      const cycleData = {
        user_id: user.id,
        cycle_start_date: selectedDate.toISOString().split('T')[0],
        cycle_length: currentCycle.cycle_length || 28,
        period_length: currentCycle.period_length || 5,
        symptoms: currentCycle.symptoms || [],
        mood: currentCycle.mood || 'normal',
        flow_intensity: currentCycle.flow_intensity || 'medium',
        notes: currentCycle.notes
      };

      const { error } = await supabase
        .from('menstrual_cycles')
        .insert(cycleData);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Cycle data saved successfully!',
      });

      loadCycleData();
      setCurrentCycle({
        cycle_length: 28,
        period_length: 5,
        symptoms: [],
        mood: 'normal',
        flow_intensity: 'medium'
      });
    } catch (error) {
      console.error('Error saving cycle data:', error);
      toast({
        title: 'Error',
        description: 'Failed to save cycle data.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateNextPeriod = () => {
    if (cycles.length === 0) return null;
    
    const lastCycle = cycles[0];
    if (!lastCycle) return null;
    const lastStart = new Date(lastCycle.cycle_start_date);
    const nextStart = new Date(lastStart.getTime() + (lastCycle.cycle_length * 24 * 60 * 60 * 1000));
    
    return nextStart;
  };

  const calculateFertileWindow = () => {
    if (cycles.length === 0) return null;
    
    const lastCycle = cycles[0];
    if (!lastCycle) return null;
    const lastStart = new Date(lastCycle.cycle_start_date);
    const ovulationDay = new Date(lastStart.getTime() + ((lastCycle.cycle_length - 14) * 24 * 60 * 60 * 1000));
    const fertileStart = new Date(ovulationDay.getTime() - (5 * 24 * 60 * 60 * 1000));
    const fertileEnd = new Date(ovulationDay.getTime() + (1 * 24 * 60 * 60 * 1000));
    
    return { start: fertileStart, end: fertileEnd, ovulation: ovulationDay };
  };

  const nextPeriod = calculateNextPeriod();
  const fertileWindow = calculateFertileWindow();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
            <Heart className="h-8 w-8 text-pink-500" />
            Menstrual Cycle Tracker
          </h1>
          <p className="text-gray-600">Track your cycle, symptoms, and health patterns</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Predictions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-pink-500" />
                Predictions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {nextPeriod && (
                <div className="p-3 bg-pink-100 rounded-lg">
                  <p className="font-medium text-pink-800">Next Period</p>
                  <p className="text-pink-600">{nextPeriod.toLocaleDateString()}</p>
                </div>
              )}
              
              {fertileWindow && (
                <div className="p-3 bg-green-100 rounded-lg">
                  <p className="font-medium text-green-800">Fertile Window</p>
                  <p className="text-green-600">
                    {fertileWindow.start.toLocaleDateString()} - {fertileWindow.end.toLocaleDateString()}
                  </p>
                </div>
              )}
              
              {cycles.length === 0 && (
                <div className="p-3 bg-gray-100 rounded-lg">
                  <p className="text-gray-600">Start tracking to see predictions</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cycle Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                Cycle Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cycles.length > 0 ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Average Cycle Length</p>
                    <p className="text-xl font-semibold">
                      {Math.round(cycles.reduce((sum, cycle) => sum + cycle.cycle_length, 0) / cycles.length)} days
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Average Period Length</p>
                    <p className="text-xl font-semibold">
                      {Math.round(cycles.reduce((sum, cycle) => sum + cycle.period_length, 0) / cycles.length)} days
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Cycles Tracked</p>
                    <p className="text-xl font-semibold">{cycles.length}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">No data yet</p>
              )}
            </CardContent>
          </Card>

          {/* Health Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                Health Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cycles.length >= 3 ? (
                <div className="space-y-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <p className="text-blue-800 text-sm">
                      Your cycle length is {cycles.length > 0 ? 'regular' : 'tracking needed'}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <p className="text-green-800 text-sm">
                      Good tracking consistency!
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    Track at least 3 cycles for better insights
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="log" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="log">Log Cycle</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Log Cycle Tab */}
          <TabsContent value="log">
            <Card>
              <CardHeader>
                <CardTitle>Log New Cycle</CardTitle>
                <CardDescription>
                  Record your cycle start date and symptoms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Cycle Start Date</Label>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="cycle-length">Cycle Length (days)</Label>
                        <Input
                          id="cycle-length"
                          type="number"
                          value={currentCycle.cycle_length || ''}
                          onChange={(e) => setCurrentCycle({
                            ...currentCycle,
                            cycle_length: parseInt(e.target.value) || 28
                          })}
                          min="21"
                          max="45"
                        />
                      </div>
                      <div>
                        <Label htmlFor="period-length">Period Length (days)</Label>
                        <Input
                          id="period-length"
                          type="number"
                          value={currentCycle.period_length || ''}
                          onChange={(e) => setCurrentCycle({
                            ...currentCycle,
                            period_length: parseInt(e.target.value) || 5
                          })}
                          min="1"
                          max="10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Flow Intensity</Label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {['light', 'medium', 'heavy'].map((intensity) => (
                          <Button
                            key={intensity}
                            variant={currentCycle.flow_intensity === intensity ? 'default' : 'outline'}
                            onClick={() => setCurrentCycle({
                              ...currentCycle,
                              flow_intensity: intensity as 'light' | 'medium' | 'heavy'
                            })}
                            className="capitalize"
                          >
                            {intensity}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Mood</Label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {moods.map((mood) => (
                          <Button
                            key={mood}
                            variant={currentCycle.mood === mood.toLowerCase() ? 'default' : 'outline'}
                            onClick={() => setCurrentCycle({
                              ...currentCycle,
                              mood: mood.toLowerCase()
                            })}
                            size="sm"
                          >
                            {mood}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Symptoms</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {symptoms.map((symptom) => (
                          <Button
                            key={symptom}
                            variant={currentCycle.symptoms?.includes(symptom) ? 'default' : 'outline'}
                            onClick={() => {
                              const currentSymptoms = currentCycle.symptoms || [];
                              const newSymptoms = currentSymptoms.includes(symptom)
                                ? currentSymptoms.filter(s => s !== symptom)
                                : [...currentSymptoms, symptom];
                              setCurrentCycle({
                                ...currentCycle,
                                symptoms: newSymptoms
                              });
                            }}
                            size="sm"
                            className="justify-start"
                          >
                            {symptom}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        placeholder="Any additional notes..."
                        value={currentCycle.notes || ''}
                        onChange={(e) => setCurrentCycle({
                          ...currentCycle,
                          notes: e.target.value
                        })}
                      />
                    </div>

                    <Button
                      onClick={saveCycleData}
                      disabled={loading || !selectedDate}
                      className="w-full"
                    >
                      {loading ? 'Saving...' : 'Save Cycle Data'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Calendar View Tab */}
          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle>Cycle Calendar</CardTitle>
                <CardDescription>
                  View your cycles and predictions on a calendar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="destructive">Period Days</Badge>
                    <Badge variant="secondary">Fertile Window</Badge>
                    <Badge variant="outline">Ovulation</Badge>
                  </div>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border w-full"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Cycle History</CardTitle>
                <CardDescription>
                  View your past cycles and track patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                {cycles.length > 0 ? (
                  <div className="space-y-4">
                    {cycles.map((cycle) => (
                      <div key={cycle.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium">
                            {new Date(cycle.cycle_start_date).toLocaleDateString()}
                          </p>
                          <div className="flex gap-2">
                            <Badge variant="outline">
                              {cycle.cycle_length} day cycle
                            </Badge>
                            <Badge variant="outline">
                              {cycle.period_length} day period
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">Flow:</span>
                            <Badge 
                              variant={
                                cycle.flow_intensity === 'heavy' ? 'destructive' :
                                cycle.flow_intensity === 'medium' ? 'default' : 'secondary'
                              }
                            >
                              {cycle.flow_intensity}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">Mood:</span>
                            <span className="capitalize">{cycle.mood}</span>
                          </div>
                          
                          {cycle.symptoms.length > 0 && (
                            <div>
                              <span className="text-gray-600">Symptoms:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {cycle.symptoms.map((symptom) => (
                                  <Badge key={symptom} variant="outline" className="text-xs">
                                    {symptom}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {cycle.notes && (
                            <div>
                              <span className="text-gray-600">Notes:</span>
                              <p className="text-gray-800 mt-1">{cycle.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No cycles recorded yet.</p>
                    <p className="text-gray-400 text-sm">Start by logging your first cycle.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MenstrualCycleTracker;