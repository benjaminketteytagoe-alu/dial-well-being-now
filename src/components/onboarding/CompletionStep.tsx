
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface CompletionStepProps {
  userData: any;
  prevStep: () => void;
  isLast: boolean;
}

const CompletionStep = ({ userData, prevStep }: CompletionStepProps) => {
  const navigate = useNavigate();

  const handleComplete = () => {
    // Here you would typically save the user data to your backend
    console.log('User onboarding completed:', userData);
    // Redirect to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="text-green-600" size={32} />
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Welcome to NauriCare, {userData.name || 'there'}!
        </h3>
        <p className="text-gray-600">
          Your account has been set up successfully. You're now ready to start your health journey with us.
        </p>
      </div>

      <div className="bg-orange-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-800 mb-2">What's Next?</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Complete your first symptom check</li>
          <li>• Explore health tips and resources</li>
          <li>• Set up your health tracking preferences</li>
          <li>• Book your first consultation</li>
        </ul>
      </div>

      <div className="flex space-x-3">
        <Button 
          variant="outline" 
          onClick={prevStep}
          className="flex-1"
        >
          Back
        </Button>
        <Button 
          onClick={handleComplete}
          className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
        >
          Go to Dashboard
          <ArrowRight className="ml-2" size={16} />
        </Button>
      </div>
    </div>
  );
};

export default CompletionStep;
