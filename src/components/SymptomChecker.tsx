import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Add this type definition at the top of the file
type ReferralRecommendation = {
  // Define properties as needed, e.g.:
  clinicName?: string;
  recommendation?: string;
};

const SymptomChecker = () =>
{
  const [ currentStep, setCurrentStep ] = useState( 0 );
  const [ , setReferralResults ] = useState( [] as ReferralRecommendation[] );
  const [ selectedSymptoms, setSelectedSymptoms ] = useState<string[]>( [] ); // <-- Add this line

  const questions = [
    {
      question: "Are you experiencing any of these symptoms?",
      options: [ "Irregular periods", "Heavy bleeding", "Pelvic pain", "None of these" ]
    },
    {
      question: "How long have you been experiencing these symptoms?",
      options: [ "Less than 1 month", "1-3 months", "3-6 months", "More than 6 months" ]
    },
    {
      question: "How would you rate the severity?",
      options: [ "Mild", "Moderate", "Severe", "Unbearable" ]
    }
  ];

  const handleOptionSelect = ( option: string ) =>
  {
    const newSymptoms = [ ...selectedSymptoms ];
    newSymptoms[ currentStep ] = option;
    setSelectedSymptoms( newSymptoms );

    if ( currentStep < questions.length - 1 )
    {
      setCurrentStep( currentStep + 1 );
    }
  };

  const resetChecker = () =>
  {
    setCurrentStep( 0 );
    setSelectedSymptoms( [] );
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            AI-Powered Symptom Checker
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get personalized health insights based on your symptoms
          </p>
        </div>

        <Card className="border-0 bg-white shadow-xl">
          <CardHeader className="text-center">
            <div className="flex justify-center space-x-2 mb-4">
              { questions.map( ( _, index ) => (
                <div
                  key={ index }
                  className={ `w-3 h-3 rounded-full ${ index <= currentStep ? 'bg-orange-500' : 'bg-gray-300'
                    } transition-colors duration-300` }
                />
              ) ) }
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              { currentStep < questions.length ? questions[ currentStep ]?.question : "Assessment Complete" }
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            { currentStep < questions.length ? (
              <div className="grid gap-3">
                { questions[ currentStep ]?.options?.map( ( option, index ) => (
                  <Button
                    key={ index }
                    variant="outline"
                    className="h-auto p-4 text-left justify-start hover:bg-orange-50 hover:border-orange-300 transition-all duration-200"
                    onClick={ () => handleOptionSelect( option ) }
                  >
                    { option }
                  </Button>
                ) ) }
              </div>
            ) : (
              <div className="text-center space-y-6">
                <div className="bg-gradient-to-r from-orange-100 to-red-100 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Preliminary Assessment
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Based on your responses, we recommend consulting with a healthcare professional for proper evaluation.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    { selectedSymptoms.map( ( symptom, index ) => (
                      <Badge key={ index } className="bg-orange-200 text-orange-800">
                        { symptom }
                      </Badge>
                    ) ) }
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                  >
                    Find Nearby Clinic
                  </Button>
                  <Button
                    variant="outline"
                    onClick={ resetChecker }
                    className="border-orange-500 text-orange-600 hover:bg-orange-50"
                  >
                    Start Over
                  </Button>
                </div>
              </div>
            ) }
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default SymptomChecker;
