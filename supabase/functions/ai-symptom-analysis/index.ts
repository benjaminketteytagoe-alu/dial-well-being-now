import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symptoms, age, medicalHistory, currentMedications } = await req.json();
    
    if (!symptoms) {
      throw new Error('Symptoms are required');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Create a detailed prompt for PCOS, fibroids, and maternal health analysis
    const systemPrompt = `You are a specialized women's health AI assistant focused on detecting early signs of PCOS (Polycystic Ovary Syndrome), uterine fibroids, and maternal health issues.

Your analysis should:
1. Assess symptoms for potential PCOS indicators (irregular periods, weight gain, acne, hair growth, insulin resistance)
2. Evaluate for fibroid symptoms (heavy bleeding, pelvic pain, pressure, frequent urination)
3. Consider maternal health concerns (if applicable - pregnancy-related symptoms)
4. Provide risk assessment (Low, Moderate, High)
5. Recommend appropriate medical specializations
6. Suggest immediate actions if needed

IMPORTANT: Always recommend consulting healthcare professionals. This is preliminary assessment only.

Format your response as JSON with this structure:
{
  "riskAssessment": "Low|Moderate|High",
  "potentialConditions": ["condition1", "condition2"],
  "recommendedSpecializations": ["Gynecology", "Endocrinology", etc.],
  "urgency": "Routine|Soon|Urgent",
  "keyFindings": ["finding1", "finding2"],
  "recommendations": ["rec1", "rec2"],
  "disclaimer": "This is not a medical diagnosis..."
}`;

    const userPrompt = `Patient Information:
Age: ${age || 'Not specified'}
Symptoms: ${symptoms}
Medical History: ${medicalHistory || 'None provided'}
Current Medications: ${currentMedications || 'None listed'}

Please analyze these symptoms for potential PCOS, fibroids, or maternal health concerns.`;

    console.log('Analyzing symptoms with OpenAI...');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      throw new Error('Failed to analyze symptoms');
    }

    const data = await response.json();
    const analysisText = data.choices[0].message.content;
    
    console.log('Raw AI response:', analysisText);
    
    // Parse the JSON response from AI
    let analysis;
    try {
      analysis = JSON.parse(analysisText);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      // Fallback response if JSON parsing fails
      analysis = {
        riskAssessment: "Moderate",
        potentialConditions: ["Requires professional evaluation"],
        recommendedSpecializations: ["Gynecology"],
        urgency: "Soon",
        keyFindings: ["Multiple symptoms reported"],
        recommendations: ["Schedule appointment with gynecologist", "Keep symptom diary"],
        disclaimer: "This is not a medical diagnosis. Please consult with healthcare professionals."
      };
    }

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in AI symptom analysis:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      riskAssessment: "Unable to assess",
      disclaimer: "Analysis failed. Please consult healthcare professionals directly."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});