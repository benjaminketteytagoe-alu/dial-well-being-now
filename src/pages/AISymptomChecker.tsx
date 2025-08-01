import React from 'react';
import AISymptomChecker from '@/components/AISymptomChecker';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

const AISymptomCheckerPage: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-brand-light">
      <AISymptomChecker />
    </div>
  );
};

export default AISymptomCheckerPage;