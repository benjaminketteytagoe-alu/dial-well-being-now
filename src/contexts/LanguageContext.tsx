// @ts-nocheck
import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'sw' | 'rw';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Navigation & General
    'nav.signIn': 'Sign In',
    'nav.getStarted': 'Get Started',
    'nav.home': 'Home',
    'nav.healthInfo': 'Health Info',
    'nav.symptomChecker': 'Symptom Checker',
    'nav.bookDoctor': 'Book Doctor',
    'nav.dashboard': 'Dashboard',
    
    // Hero Section
    'hero.title': 'Your Trusted Companion for Women\'s Health',
    'hero.subtitle': 'Access comprehensive healthcare services, track your wellness journey, and connect with healthcare professionals - all in one place.',
    'hero.cta': 'Start Your Health Journey',
    
    // Auth Page
    'auth.welcome': 'Welcome to NauriCare',
    'auth.tagline': 'Your trusted companion for women\'s health',
    'auth.signIn': 'Sign In',
    'auth.signUp': 'Sign Up',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.fullName': 'Full Name',
    'auth.continueWith': 'Or continue with',
    'auth.google': 'Google',
    'auth.signingIn': 'Signing In...',
    'auth.creatingAccount': 'Creating Account...',
    'auth.connecting': 'Connecting...',
    'auth.selectLanguage': 'Select Language',
    'auth.back': 'Back to Home',
    
    // Symptom Checker
    'symptom.title': 'Symptom Checker',
    'symptom.name': 'Full Name',
    'symptom.email': 'Email Address',
    'symptom.symptoms': 'Describe your symptoms',
    'symptom.duration': 'How long have you had these symptoms?',
    'symptom.severity': 'Rate your pain/discomfort (1-10)',
    'symptom.submit': 'Submit Symptoms',
    'symptom.submitting': 'Submitting...',
    
    // Book Doctor
    'doctor.title': 'Book Doctor Appointment',
    'doctor.selectDoctor': 'Select Doctor',
    'doctor.selectDate': 'Select Date',
    'doctor.selectTime': 'Select Time',
    'doctor.reason': 'Reason for Visit',
    'doctor.book': 'Book Appointment',
    'doctor.booking': 'Booking...',
    
    // Loading
    'loading': 'Loading...',
    
    // Doctors
    'doctors.general': 'Dr. Sarah Johnson - General Practitioner',
    'doctors.gynecologist': 'Dr. Mary Uwimana - Gynecologist',
    'doctors.pediatrician': 'Dr. James Kiprotich - Pediatrician',
    'doctors.psychiatrist': 'Dr. Grace Nyong - Psychiatrist',
    'doctors.dermatologist': 'Dr. Alice Mutesi - Dermatologist',
    
    // Time slots
    'time.morning': '9:00 AM',
    'time.midMorning': '10:30 AM',
    'time.noon': '12:00 PM',
    'time.afternoon': '2:00 PM',
    'time.lateAfternoon': '3:30 PM',
    'time.evening': '5:00 PM',
  },
  
  sw: {
    // Navigation & General
    'nav.signIn': 'Ingia',
    'nav.getStarted': 'Anza',
    'nav.home': 'Nyumbani',
    'nav.healthInfo': 'Habari za Afya',
    'nav.symptomChecker': 'Kikagua Dalili',
    'nav.bookDoctor': 'Weka Miadi na Daktari',
    'nav.dashboard': 'Dashibodi',
    
    // Hero Section
    'hero.title': 'Mshirika Wako wa Kuaminika wa Afya ya Wanawake',
    'hero.subtitle': 'Pata huduma kamili za afya, fuatilia safari yako ya ustawi, na unganishwa na wataalamu wa afya - vyote mahali pamoja.',
    'hero.cta': 'Anza Safari Yako ya Afya',
    
    // Auth Page
    'auth.welcome': 'Karibu NauriCare',
    'auth.tagline': 'Mshirika wako wa kuaminika wa afya ya wanawake',
    'auth.signIn': 'Ingia',
    'auth.signUp': 'Jisajili',
    'auth.email': 'Barua pepe',
    'auth.password': 'Nywila',
    'auth.fullName': 'Jina Kamili',
    'auth.continueWith': 'Au endelea na',
    'auth.google': 'Google',
    'auth.signingIn': 'Kuingia...',
    'auth.creatingAccount': 'Kuunda akaunti...',
    'auth.connecting': 'Kuunganisha...',
    'auth.selectLanguage': 'Chagua Lugha',
    'auth.back': 'Rudi Nyumbani',
    
    // Symptom Checker
    'symptom.title': 'Kikagua Dalili',
    'symptom.name': 'Jina Kamili',
    'symptom.email': 'Barua pepe',
    'symptom.symptoms': 'Eleza dalili zako',
    'symptom.duration': 'Umekuwa na dalili hizi kwa muda gani?',
    'symptom.severity': 'Kadiria maumivu yako/usumbufu (1-10)',
    'symptom.submit': 'Tuma Dalili',
    'symptom.submitting': 'Kutuma...',
    
    // Book Doctor
    'doctor.title': 'Weka Miadi na Daktari',
    'doctor.selectDoctor': 'Chagua Daktari',
    'doctor.selectDate': 'Chagua Tarehe',
    'doctor.selectTime': 'Chagua Wakati',
    'doctor.reason': 'Sababu ya Ziara',
    'doctor.book': 'Weka Miadi',
    'doctor.booking': 'Kuweka miadi...',
    
    // Loading
    'loading': 'Inapakia...',
    
    // Doctors
    'doctors.general': 'Dkt. Sarah Johnson - Daktari wa Jumla',
    'doctors.gynecologist': 'Dkt. Mary Uwimana - Mtaalamu wa Uzazi',
    'doctors.pediatrician': 'Dkt. James Kiprotich - Daktari wa Watoto',
    'doctors.psychiatrist': 'Dkt. Grace Nyong - Daktari wa Akili',
    'doctors.dermatologist': 'Dkt. Alice Mutesi - Mtaalamu wa Ngozi',
    
    // Time slots
    'time.morning': '9:00 Asubuhi',
    'time.midMorning': '10:30 Asubuhi',
    'time.noon': '12:00 Mchana',
    'time.afternoon': '2:00 Alasiri',
    'time.lateAfternoon': '3:30 Alasiri',
    'time.evening': '5:00 Jioni',
  },
  
  rw: {
    // Navigation & General
    'nav.signIn': 'Injira',
    'nav.getStarted': 'Tangira',
    'nav.home': 'Ahabanza',
    'nav.healthInfo': 'Amakuru y\'Ubuzima',
    'nav.symptomChecker': 'Igenzura Ibimenyetso',
    'nav.bookDoctor': 'Gena Muganga',
    'nav.dashboard': 'Imbonerahamwe',
    
    // Hero Section
    'hero.title': 'Umunyangazi Wawe Wizewe mu Buzima bw\'Abagore',
    'hero.subtitle': 'Bonera serivisi zuzuye z\'ubuvuzi, gukurikira urugendo rwawe rw\'ubuzima, no guhuza n\'inzobere mu buvuzi - byose ahantu hamwe.',
    'hero.cta': 'Tangira Urugendo Rwawe rw\'Ubuzima',
    
    // Auth Page
    'auth.welcome': 'Murakaza neza kuri NauriCare',
    'auth.tagline': 'Umunyangazi wawe wizewe mu buzima bw\'abagore',
    'auth.signIn': 'Injira',
    'auth.signUp': 'Iyandikishe',
    'auth.email': 'Imeyili',
    'auth.password': 'Ijambobanga',
    'auth.fullName': 'Izina Ryuzuye',
    'auth.continueWith': 'Cyangwa komeza na',
    'auth.google': 'Google',
    'auth.signingIn': 'Kwinjira...',
    'auth.creatingAccount': 'Gukora konti...',
    'auth.connecting': 'Guhuza...',
    'auth.selectLanguage': 'Hitamo Ururimi',
    'auth.back': 'Subira Ahabanza',
    
    // Symptom Checker
    'symptom.title': 'Igenzura Ibimenyetso',
    'symptom.name': 'Izina Ryuzuye',
    'symptom.email': 'Imeyili',
    'symptom.symptoms': 'Sobanura ibimenyetso byawe',
    'symptom.duration': 'Ni igihe kingana iki waba ufite ibi bimenyetso?',
    'symptom.severity': 'Gena ububabare bwawe (1-10)',
    'symptom.submit': 'Ohereza Ibimenyetso',
    'symptom.submitting': 'Kohereza...',
    
    // Book Doctor
    'doctor.title': 'Gena Muganga',
    'doctor.selectDoctor': 'Hitamo Muganga',
    'doctor.selectDate': 'Hitamo Itariki',
    'doctor.selectTime': 'Hitamo Igihe',
    'doctor.reason': 'Impamvu yo Gusura',
    'doctor.book': 'Gena',
    'doctor.booking': 'Gukoresha...',
    
    // Loading
    'loading': 'Gutwara...',
    
    // Doctors
    'doctors.general': 'Dr. Sarah Johnson - Muganga Rusange',
    'doctors.gynecologist': 'Dr. Mary Uwimana - Impuguke mu Buzima bw\'Abagore',
    'doctors.pediatrician': 'Dr. James Kiprotich - Muganga w\'Abana',
    'doctors.psychiatrist': 'Dr. Grace Nyong - Muganga w\'Ubwoba',
    'doctors.dermatologist': 'Dr. Alice Mutesi - Impuguke mu Ruhu',
    
    // Time slots
    'time.morning': '9:00 mu gitondo',
    'time.midMorning': '10:30 mu gitondo',
    'time.noon': '12:00 ku mucana',
    'time.afternoon': '2:00 nyuma ya saa sita',
    'time.lateAfternoon': '3:30 nyuma ya saa sita',
    'time.evening': '5:00 ku mugoroba',
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('nauricare-language') as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('nauricare-language', language);
  }, [language]);

  const t = (key: string): string => {
    const translation = translations[language] as Record<string, string>;
    return translation[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};