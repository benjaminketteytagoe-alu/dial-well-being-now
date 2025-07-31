# AI-Powered Symptom Checker & Referral Engine Setup

This guide will help you set up the AI-powered symptom checker and referral engine for PCOS, fibroids, and maternal health.

## Features Implemented

### 1. AI Symptom Checker
- **Comprehensive Assessment**: Multi-step questionnaire covering symptoms, medical history, and lifestyle factors
- **AI Analysis**: OpenAI-powered analysis for PCOS, fibroids, and maternal health conditions
- **Personalized Insights**: Risk level assessment, confidence scores, and actionable recommendations
- **Fallback System**: Rule-based analysis when AI is unavailable

### 2. Referral Engine
- **Specialist Matching**: AI-driven recommendations based on analysis results
- **Hospital Database**: Comprehensive database of hospitals and specialists
- **Booking System**: Direct appointment booking with healthcare providers
- **Search & Filter**: Advanced search with location, specialty, and price filters

### 3. Database Integration
- **Symptom Analysis Storage**: Complete history of user assessments
- **Hospital & Doctor Data**: Structured database with ratings and availability
- **Appointment Management**: Full appointment lifecycle management
- **Analytics**: User health analytics and insights

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in your project root with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# OpenAI Configuration (for AI symptom analysis)
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Optional: Environment
NODE_ENV=development
```

### 2. OpenAI API Setup

1. Sign up for an OpenAI account at https://platform.openai.com
2. Create an API key in your OpenAI dashboard
3. Add the API key to your `.env` file
4. Ensure you have sufficient credits for API calls

### 3. Database Setup

Run the database migration to create the required tables:

```bash
# Apply the migration
supabase db push
```

This will create:
- `symptom_analysis` table for storing AI analysis results
- `hospitals` table for hospital information
- `doctors` table for doctor profiles
- `appointments` table for appointment management

### 4. Sample Data

The migration includes sample data for:
- 3 major hospitals in Nairobi
- 4 specialized doctors with detailed profiles
- Complete hospital and doctor information

## Usage

### For Users

1. **Start Symptom Check**: Navigate to the Symptom Checker page
2. **Complete Assessment**: Answer questions about symptoms, medical history, and lifestyle
3. **Get AI Analysis**: Receive personalized health insights and risk assessment
4. **Find Specialists**: Browse recommended healthcare providers
5. **Book Appointments**: Schedule appointments directly through the platform

### For Developers

#### AI Service Integration

```typescript
import { AISymptomChecker } from '@/services/aiService';

// Analyze symptoms
const result = await AISymptomChecker.analyzeSymptoms(symptomData);

// Get referral recommendations
const referrals = AISymptomChecker.getReferralRecommendations(result);
```

#### Database Operations

```typescript
import { DatabaseService } from '@/services/databaseService';

// Save analysis results
await DatabaseService.saveSymptomAnalysis(symptomData, analysisResult);

// Get user history
const history = await DatabaseService.getUserSymptomHistory();

// Create appointment
await DatabaseService.createAppointment(appointmentData);
```

## Component Structure

### Core Components

1. **AISymptomChecker** (`src/components/AISymptomChecker.tsx`)
   - Multi-step symptom assessment
   - AI analysis integration
   - Results display

2. **ReferralEngine** (`src/components/ReferralEngine.tsx`)
   - Doctor and hospital search
   - Appointment booking
   - Filtering and sorting

3. **SymptomChecker Page** (`src/pages/SymptomChecker.tsx`)
   - Main page integration
   - Tab navigation
   - Quick actions

### Services

1. **AI Service** (`src/services/aiService.ts`)
   - OpenAI integration
   - Symptom analysis logic
   - Referral recommendations

2. **Database Service** (`src/services/databaseService.ts`)
   - Supabase operations
   - Data management
   - Analytics

## AI Analysis Features

### Symptom Categories

1. **PCOS Symptoms**
   - Irregular periods
   - Weight gain
   - Acne
   - Excessive hair growth
   - Hair loss
   - Dark patches on skin

2. **Fibroid Symptoms**
   - Heavy menstrual bleeding
   - Pelvic pain or pressure
   - Frequent urination
   - Constipation
   - Back pain
   - Leg pain

3. **Maternal Health Symptoms**
   - Pregnancy-related symptoms
   - Fertility concerns
   - Morning sickness
   - Fatigue
   - Mood changes

### Analysis Output

- **Condition**: Identified health condition
- **Confidence**: AI confidence score (0-1)
- **Risk Level**: Low, Medium, or High
- **Urgency**: Routine, Soon, or Immediate
- **Recommendations**: Actionable health advice
- **Next Steps**: Specific actions to take

## Referral System

### Hospital Database

- **Nairobi Women's Hospital**: Specialized in women's health
- **Aga Khan University Hospital**: Research and advanced care
- **Kenyatta National Hospital**: Public healthcare

### Doctor Specialties

- **Gynecologists**: General women's health
- **Obstetricians**: Pregnancy and childbirth
- **Endocrinologists**: Hormonal disorders (PCOS)
- **Specialists**: PCOS, Fibroids, Maternal Health

### Booking Features

- Real-time availability checking
- Multiple time slot options
- Reason for visit documentation
- Appointment status tracking

## Security & Privacy

### Data Protection

- All user data is encrypted
- HIPAA-compliant data handling
- Secure API communications
- User authentication required

### AI Safety

- Medical disclaimers included
- Professional consultation recommended
- Emergency symptom warnings
- Fallback analysis system

## Troubleshooting

### Common Issues

1. **OpenAI API Errors**
   - Check API key validity
   - Verify account credits
   - Review rate limits

2. **Database Connection Issues**
   - Verify Supabase credentials
   - Check network connectivity
   - Review RLS policies

3. **Component Loading Issues**
   - Check import paths
   - Verify TypeScript types
   - Review component dependencies

### Performance Optimization

1. **AI Response Caching**
   - Implement result caching
   - Reduce API calls
   - Optimize prompts

2. **Database Queries**
   - Use proper indexes
   - Optimize joins
   - Implement pagination

## Future Enhancements

### Planned Features

1. **Advanced AI Models**
   - GPT-4 integration
   - Custom medical models
   - Multi-language support

2. **Enhanced Referrals**
   - Insurance integration
   - Telemedicine options
   - Second opinion system

3. **Analytics Dashboard**
   - Health trend analysis
   - Symptom tracking
   - Progress monitoring

### Integration Opportunities

1. **Electronic Health Records**
   - Hospital system integration
   - Medical history sync
   - Prescription management

2. **Mobile App**
   - Native mobile experience
   - Push notifications
   - Offline functionality

3. **Telemedicine**
   - Video consultations
   - Remote monitoring
   - Digital prescriptions

## Support

For technical support or questions about the implementation:

1. Check the component documentation
2. Review the service implementations
3. Test with sample data
4. Monitor console logs for errors

## License

This implementation is part of the Dial Well-Being Now project and follows the project's licensing terms. 