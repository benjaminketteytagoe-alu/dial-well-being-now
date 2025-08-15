
import { Button } from "@/components/ui/button";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import AccessPoints from "@/components/AccessPoints";
import Impact from "@/components/Impact";
import Partners from "@/components/Partners";
import SymptomChecker from "@/components/SymptomChecker";
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const Index = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-brand-light">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img  
                className="h-8 w-auto"
                src="https://i.ibb.co/4ZyKvZJx/Nauri-Care-Color-B.png"
                alt="logo"
              />
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline"
                onClick={() => navigate('/auth')}
              >
                {t('nav.signIn')}
              </Button>
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-primary hover:bg-primary/90"
              >
                {t('nav.getStarted')}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <Hero />
      <Services />
      <AccessPoints />
      <SymptomChecker />
      <Impact />
      <Partners />
    </div>
  );
};

export default Index;
