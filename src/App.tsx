import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { LanguageProvider } from '@/contexts/LanguageContext';
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Onboarding from "./components/Onboarding";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import HealthInfo from "./pages/HealthInfo";
import SymptomChecker from "./pages/SymptomChecker";
import BookDoctor from "./pages/BookDoctor";
import Teleconsultation from "./pages/Teleconsultation";
import TeleconsultationSession from "./components/TeleconsultationSession";
import Community from "./pages/Community";
import ForumDetail from "./pages/ForumDetail";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-primary rounded-full animate-pulse mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-primary rounded-full animate-pulse mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (user) {
    return <Navigate to="/home" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <TooltipProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<PublicRoute><Auth /></PublicRoute>} />
              <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/health-info" element={<ProtectedRoute><HealthInfo /></ProtectedRoute>} />
              <Route path="/symptom-checker" element={<ProtectedRoute><SymptomChecker /></ProtectedRoute>} />
              <Route path="/book-doctor" element={<ProtectedRoute><BookDoctor /></ProtectedRoute>} />
              <Route path="/teleconsultation" element={<ProtectedRoute><Teleconsultation /></ProtectedRoute>} />
              {/* FIXED: Removed hardcoded sessionId="" prop - component now uses useParams */}
              <Route path="/teleconsultation/session/:sessionId" element={<ProtectedRoute><TeleconsultationSession /></ProtectedRoute>} />
              <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
              <Route path="/community/forum/:forumId" element={<ProtectedRoute><ForumDetail /></ProtectedRoute>} />
              <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);