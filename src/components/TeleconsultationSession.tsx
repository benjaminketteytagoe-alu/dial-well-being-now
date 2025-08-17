// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare, Settings } from 'lucide-react';

interface TeleconsultationSessionProps {
  // Remove sessionId prop since we'll get it from URL params
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  avatar?: string;
}

interface SessionData {
  id: string;
  doctor?: Doctor;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  session_type: 'video' | 'audio' | 'chat';
  scheduled_time: string;
  started_at?: string;
  ended_at?: string;
}

const TeleconsultationSession: React.FC<TeleconsultationSessionProps> = () => {
  // Get sessionId from URL parameters
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);

  // Validate sessionId
  useEffect(() => {
    if (!sessionId) {
      setError('No session ID provided');
      setLoading(false);
      return;
    }

    // Fetch session data using the sessionId from URL
    fetchSessionData(sessionId);
  }, [sessionId]);

  const fetchSessionData = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      
      // Mock data for now - replace with actual API call
      const mockSession: SessionData = {
        id: id,
        doctor: {
          id: '1',
          name: 'Dr. Sarah Mwangi',
          specialty: 'Gynecologist',
          avatar: '/api/placeholder/40/40'
        },
        status: 'in-progress',
        session_type: 'video',
        scheduled_time: new Date().toISOString(),
        started_at: new Date().toISOString()
      };

      setSession(mockSession);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load session');
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (session?.status === 'in-progress') {
      const interval = setInterval(() => {
        setSessionDuration(prev => prev + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
    return;
  }, [session?.status]);

  const handleEndCall = () => {
    // Add logic to end the call
    navigate('/teleconsultation');
  };

  const toggleMute = () => setIsMuted(!isMuted);
  const toggleVideo = () => setIsVideoOn(!isVideoOn);

  // Handle loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading session...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error || !session) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Session Not Found</h2>
          <p className="text-gray-400 mb-6">{error || 'The requested session could not be found.'}</p>
          <Button onClick={() => navigate('/teleconsultation')} variant="outline">
            Back to Teleconsultation
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/teleconsultation')} className="text-white">
              ← Back
            </Button>
            <div>
              <h1 className="text-lg font-semibold">
                {session.doctor?.name || 'Unknown Doctor'}
              </h1>
              <p className="text-sm text-gray-400">
                {session.doctor?.specialty || 'General'} • {session.session_type} consultation
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>{formatDuration(sessionDuration)}</span>
            </div>
            <Badge variant={session.status === 'in-progress' ? 'default' : 'secondary'}>
              {session.status.replace('-', ' ')}
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
            {/* Video Area */}
            <div className="lg:col-span-3 bg-gray-800 rounded-lg relative overflow-hidden">
              <div className="aspect-video bg-gray-700 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-semibold">
                      {session.doctor?.name?.split(' ').map(n => n[0]).join('') || 'DR'}
                    </span>
                  </div>
                  <p className="text-xl font-semibold">{session.doctor?.name}</p>
                  <p className="text-gray-400">{session.doctor?.specialty}</p>
                </div>
              </div>

              {/* Controls */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="flex items-center space-x-4 bg-gray-900 bg-opacity-80 p-3 rounded-lg">
                  <Button
                    variant={isMuted ? "destructive" : "secondary"}
                    size="sm"
                    onClick={toggleMute}
                  >
                    {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>
                  
                  <Button
                    variant={!isVideoOn ? "destructive" : "secondary"}
                    size="sm"
                    onClick={toggleVideo}
                  >
                    {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                  </Button>
                  
                  <Button variant="secondary" size="sm">
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                  
                  <Button variant="secondary" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                  
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={handleEndCall}
                  >
                    <PhoneOff className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Session Info */}
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Session Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Session ID:</span>
                    <span className="font-mono">{sessionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Type:</span>
                    <span className="capitalize">{session.session_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <Badge variant={session.status === 'in-progress' ? 'default' : 'secondary'} className="text-xs">
                      {session.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Duration:</span>
                    <span>{formatDuration(sessionDuration)}</span>
                  </div>
                </div>
              </div>

              {/* Chat */}
              <div className="bg-gray-800 p-4 rounded-lg flex-1">
                <h3 className="font-semibold mb-3">Chat</h3>
                <div className="space-y-3 h-64 overflow-y-auto">
                  <div className="text-sm">
                    <p className="text-gray-400">Dr. {session.doctor?.name}</p>
                    <p className="bg-gray-700 p-2 rounded mt-1">Hello! How are you feeling today?</p>
                  </div>
                </div>
                <div className="mt-3">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeleconsultationSession;