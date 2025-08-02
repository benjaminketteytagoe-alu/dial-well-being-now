import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  MessageSquare, 
  Send, 
  Clock, 
  User, 
  Stethoscope,
  Camera,
  CameraOff,
  Settings,
  Volume2,
  VolumeX
} from "lucide-react";
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { TeleconsultationService, TeleconsultationSession } from '@/services/teleconsultationService';
import { format } from 'date-fns';

interface TeleconsultationSessionProps {
  sessionId: string;
}

const TeleconsultationSessionComponent: React.FC<TeleconsultationSessionProps> = ({ sessionId }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [session, setSession] = useState<TeleconsultationSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [prescriptionNotes, setPrescriptionNotes] = useState('');
  const [followUpRequired, setFollowUpRequired] = useState(false);
  const [followUpDate, setFollowUpDate] = useState('');
  
  // Media controls state
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  // Chat state
  const [chatMessages, setChatMessages] = useState<Array<{
    id: string;
    sender: 'user' | 'doctor';
    message: string;
    timestamp: Date;
  }>>([]);
  const [newMessage, setNewMessage] = useState('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    loadSession();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [sessionId]);

  useEffect(() => {
    if (sessionStarted && !sessionEnded) {
      intervalRef.current = setInterval(() => {
        setSessionDuration(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [sessionStarted, sessionEnded]);

  useEffect(() => {
    // Auto-scroll chat to bottom
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const loadSession = async () => {
    try {
      const sessionData = await TeleconsultationService.getSessionById(sessionId);
      if (sessionData) {
        setSession(sessionData);
        if (sessionData.status === 'in-progress') {
          setSessionStarted(true);
        }
      } else {
        toast({
          title: "Session Not Found",
          description: "The requested session could not be found.",
          variant: "destructive"
        });
        navigate('/teleconsultation');
      }
    } catch (error) {
      console.error('Error loading session:', error);
      toast({
        title: "Error",
        description: "Failed to load session details.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const startSession = async () => {
    try {
      await TeleconsultationService.startSession(sessionId);
      setSessionStarted(true);
      toast({
        title: "Session Started",
        description: "Your teleconsultation session has begun.",
      });
    } catch (error) {
      console.error('Error starting session:', error);
      toast({
        title: "Error",
        description: "Failed to start the session.",
        variant: "destructive"
      });
    }
  };

  const endSession = async () => {
    try {
      await TeleconsultationService.endSession(
        sessionId,
        prescriptionNotes,
        followUpRequired,
        followUpDate
      );
      setSessionEnded(true);
      toast({
        title: "Session Ended",
        description: "Your teleconsultation session has been completed.",
      });
      
      // Navigate back after a short delay
      setTimeout(() => {
        navigate('/teleconsultation');
      }, 3000);
    } catch (error) {
      console.error('Error ending session:', error);
      toast({
        title: "Error",
        description: "Failed to end the session.",
        variant: "destructive"
      });
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message = {
      id: Date.now().toString(),
      sender: 'user' as const,
      message: newMessage.trim(),
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, message]);
    setNewMessage('');
    
    // Simulate doctor response (in real implementation, this would be real-time)
    setTimeout(() => {
      const doctorResponse = {
        id: (Date.now() + 1).toString(),
        sender: 'doctor' as const,
        message: `Thank you for your message. I'm reviewing your information.`,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, doctorResponse]);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading session...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <p>Session not found</p>
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

                Dr. Sarah Mwangi
              </h1>
              <p className="text-sm text-gray-400">
                Gynecologist • {session.session_type} consultation
13d9f2ce17db08744c3c68cd476ee9e08750794b
              </p>
            </div>
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

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Video Area */}
          <div className="lg:col-span-2 space-y-4">
            {/* Remote Video */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-0">
                <div className="aspect-video bg-gray-900 flex items-center justify-center relative">
                  {session.session_type === 'video' ? (
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      autoPlay
                      playsInline
                    />
                  ) : (
                    <div className="text-center">
                      <User className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">
                        {session.session_type === 'audio' ? 'Audio Call' : 'Text Chat'}
                      </p>
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary">
                      {session.doctors?.name || 'Unknown Doctor'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Local Video (for video sessions) */}
            {session.session_type === 'video' && (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-0">
                  <div className="aspect-video bg-gray-900 flex items-center justify-center relative">
                    <video
                      ref={localVideoRef}
                      className="w-full h-full object-cover"
                      autoPlay
                      playsInline
                      muted
                    />
                    <div className="absolute top-4 left-4">
                      <Badge variant="secondary">You</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Controls */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-center space-x-4">
                  {session.session_type === 'video' && (
                    <>
                      <Button
                        variant={isVideoEnabled ? "default" : "destructive"}
                        size="lg"
                        onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                      >
                        {isVideoEnabled ? <Camera className="w-5 h-5" /> : <CameraOff className="w-5 h-5" />}
                      </Button>
                      <Button
                        variant={isScreenSharing ? "default" : "outline"}
                        size="lg"
                        onClick={() => setIsScreenSharing(!isScreenSharing)}
                      >
                        <Settings className="w-5 h-5" />
                      </Button>
                    </>
                  )}
                  
                  <Button
                    variant={isAudioEnabled ? "default" : "destructive"}
                    size="lg"
                    onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                  >
                    {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                  </Button>
                  
                  <Button
                    variant={isMuted ? "default" : "outline"}
                    size="lg"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </Button>

                  {!sessionStarted ? (
                    <Button
                      onClick={startSession}
                      className="bg-green-600 hover:bg-green-700"
                      size="lg"
                    >
                      Start Session
                    </Button>
                  ) : !sessionEnded ? (
                    <Button
                      onClick={endSession}
                      variant="destructive"
                      size="lg"
                    >
                      End Session
                    </Button>
                  ) : (
                    <Button
                      onClick={() => navigate('/teleconsultation')}
                      size="lg"
                    >
                      Back to Sessions
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat and Notes Sidebar */}
          <div className="space-y-4">
            {/* Chat Interface */}
            {(session.session_type === 'chat' || session.session_type === 'video') && (
              <Card className="bg-gray-800 border-gray-700 h-96">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Chat</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="flex flex-col h-80">
                    {/* Chat Messages */}
                    <div 
                      ref={chatContainerRef}
                      className="flex-1 overflow-y-auto p-4 space-y-3"
                    >
                      {chatMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs px-3 py-2 rounded-lg ${
                              message.sender === 'user'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-700 text-gray-200'
                            }`}
                          >
                            <p className="text-sm">{message.message}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {format(message.timestamp, 'HH:mm')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Message Input */}
                    <div className="p-4 border-t border-gray-700">
                      <div className="flex space-x-2">
                        <Input
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Type your message..."
                          className="flex-1 bg-gray-700 border-gray-600 text-white"
                        />
                        <Button onClick={sendMessage} size="sm">
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Session Notes */}
            {sessionStarted && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle>Session Notes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Prescription Notes</label>
                    <Textarea
                      value={prescriptionNotes}
                      onChange={(e) => setPrescriptionNotes(e.target.value)}
                      placeholder="Enter prescription notes..."
                      className="mt-1 bg-gray-700 border-gray-600 text-white"
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="followUp"
                      checked={followUpRequired}
                      onChange={(e) => setFollowUpRequired(e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="followUp" className="text-sm">Follow-up required</label>
                  </div>
                  
                  {followUpRequired && (
                    <div>
                      <label className="text-sm font-medium">Follow-up Date</label>
                      <Input
                        type="date"
                        value={followUpDate}
                        onChange={(e) => setFollowUpDate(e.target.value)}
                        className="mt-1 bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeleconsultationSessionComponent;