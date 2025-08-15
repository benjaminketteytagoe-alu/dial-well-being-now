import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, 
  Users, 
  Search, 
  Plus, 
  Heart, 
  Calendar,
  Clock,
  Target,
  BookOpen
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { CommunityService, CommunityForum, MentorshipProgram, CoachingSession } from '@/services/communityService';

const Community = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  // const { t } = useLanguage();
  
  const [loading, setLoading] = useState(true);
  const [forums, setForums] = useState<CommunityForum[]>([]);
  const [mentorshipPrograms, setMentorshipPrograms] = useState<MentorshipProgram[]>([]);
  const [coachingSessions, setCoachingSessions] = useState<CoachingSession[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'pcos', label: 'PCOS' },
    { value: 'fibroids', label: 'Fibroids' },
    { value: 'maternal_health', label: 'Maternal Health' },
    { value: 'mental_health', label: 'Mental Health' },
    { value: 'nutrition', label: 'Nutrition' },
    { value: 'exercise', label: 'Exercise' }
  ];

  useEffect(() => {
    if (user) {
      loadCommunityData();
    }
  }, [user]);

  const loadCommunityData = async () => {
    setLoading(true);
    try {
      const [forumsData, programsData, sessionsData] = await Promise.all([
        CommunityService.getForums(),
        CommunityService.getMentorshipPrograms(),
        user ? CommunityService.getUserCoachingSessions(user.id) : Promise.resolve([])
      ]);
      
      setForums(forumsData);
      setMentorshipPrograms(programsData);
      setCoachingSessions(sessionsData);
    } catch (error) {
      console.error('Error loading community data:', error);
      toast({
        title: "Error",
        description: "Failed to load community data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleJoinForum = (forumId: string) => {
    navigate(`/community/forum/${forumId}`);
  };

  const handleJoinMentorship = async (programId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to join mentorship programs.",
        variant: "destructive"
      });
      return;
    }

    try {
      await CommunityService.joinMentorshipProgram(user.id, programId);
      toast({
        title: "Success",
        description: "You've successfully joined the mentorship program!",
      });
      loadCommunityData(); // Refresh data
    } catch (error) {
      console.error('Error joining mentorship program:', error);
      toast({
        title: "Error",
        description: "Failed to join the mentorship program.",
        variant: "destructive"
      });
    }
  };

  const handleBookCoaching = () => {
    navigate('/community/coaching');
  };

  const filteredForums = forums.filter(forum => {
    const matchesCategory = selectedCategory === 'all' || forum.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      forum.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      forum.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredPrograms = mentorshipPrograms.filter(program => {
    const matchesCategory = selectedCategory === 'all' || program.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4 py-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center space-x-3 max-w-6xl mx-auto">
          <Button variant="ghost" onClick={() => navigate('/home')}>
            ← Back
          </Button>
          <div className="flex items-center space-x-3">
            <img  
              className="h-8 w-auto"
              src="https://i.ibb.co/whR2z9DX/logo1b.png"
              alt="logo"
            />
            <h1 className="text-xl font-bold text-gray-800">Community Support</h1>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Connect & Support
          </h2>
          <p className="text-gray-600">
            Join peer-led forums, mentorship programs, and coaching sessions
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search forums, programs, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Tabs defaultValue="forums" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="forums">Peer Forums</TabsTrigger>
            <TabsTrigger value="mentorship">Mentorship</TabsTrigger>
            <TabsTrigger value="coaching">Coaching</TabsTrigger>
          </TabsList>

          {/* Peer Forums Tab */}
          <TabsContent value="forums" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Peer-Led Forums</h3>
              <Button onClick={() => navigate('/community/create-post')}>
                <Plus className="w-4 h-4 mr-2" />
                Create Post
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredForums.map((forum) => (
                <Card key={forum.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{forum.name}</CardTitle>
                      <Badge variant="secondary">{forum.member_count} members</Badge>
                    </div>
                    <CardDescription>{forum.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="capitalize">
                          {forum.category.replace('_', ' ')}
                        </Badge>
                        {forum.is_peer_led && (
                          <Badge variant="default">Peer-Led</Badge>
                        )}
                      </div>
                      <Button 
                        onClick={() => handleJoinForum(forum.id)}
                        className="w-full"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Join Discussion
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Mentorship Tab */}
          <TabsContent value="mentorship" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Mentorship Programs</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPrograms.map((program) => (
                <Card key={program.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{program.title}</CardTitle>
                      <Badge variant={program.current_participants >= program.max_participants ? "destructive" : "secondary"}>
                        {program.current_participants}/{program.max_participants}
                      </Badge>
                    </div>
                    <CardDescription>{program.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{program.duration_weeks} weeks</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{program.current_participants} participants</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="capitalize">
                          {program.category.replace('_', ' ')}
                        </Badge>
                      </div>

                      <Button 
                        onClick={() => handleJoinMentorship(program.id)}
                        disabled={program.current_participants >= program.max_participants}
                        className="w-full"
                      >
                        <Users className="w-4 h-4 mr-2" />
                        {program.current_participants >= program.max_participants ? 'Full' : 'Join Program'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Coaching Tab */}
          <TabsContent value="coaching" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Coaching Sessions</h3>
              <Button onClick={handleBookCoaching}>
                <Plus className="w-4 h-4 mr-2" />
                Book Session
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Available Coaching Types */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="w-5 h-5" />
                    <span>Available Sessions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { type: 'nutrition', label: 'Nutrition Coaching', icon: BookOpen },
                      { type: 'exercise', label: 'Exercise Coaching', icon: Target },
                      { type: 'mental_health', label: 'Mental Health Coaching', icon: Heart },
                      { type: 'lifestyle', label: 'Lifestyle Coaching', icon: Users },
                      { type: 'stress_management', label: 'Stress Management', icon: Clock }
                    ].map((session) => {
                      const Icon = session.icon;
                      return (
                        <div key={session.type} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Icon className="w-5 h-5 text-blue-600" />
                            <span className="font-medium">{session.label}</span>
                          </div>
                          <Button size="sm" onClick={handleBookCoaching}>
                            Book
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* User's Coaching Sessions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>My Sessions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {coachingSessions.length > 0 ? (
                    <div className="space-y-3">
                      {coachingSessions.slice(0, 3).map((session) => (
                        <div key={session.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium capitalize">{session.session_type.replace('_', ' ')}</p>
                              <p className="text-sm text-gray-600">{session.session_date} at {session.session_time}</p>
                            </div>
                            <Badge variant={session.status === 'completed' ? 'default' : session.status === 'scheduled' ? 'secondary' : 'destructive'}>
                              {session.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No coaching sessions booked yet.</p>
                      <Button onClick={handleBookCoaching} className="mt-2">
                        Book Your First Session
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Community; 