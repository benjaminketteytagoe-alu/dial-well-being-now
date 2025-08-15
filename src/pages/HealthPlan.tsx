import PersonalizedHealthPlan from '@/components/PersonalizedHealthPlan';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

const HealthPlanPage = () => {
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

  return <PersonalizedHealthPlan />;
};

export default HealthPlanPage;