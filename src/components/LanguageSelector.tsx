import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const languages = [
    { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
    { code: 'sw' as Language, name: 'Kiswahili', flag: '🇰🇪' },
    { code: 'rw' as Language, name: 'Kinyarwanda', flag: '🇷🇼' },
  ];

  return (
    <div className="flex items-center space-x-2">
      <Globe className="h-4 w-4 text-primary" />
      <Select value={language} onValueChange={(value: Language) => setLanguage(value)}>
        <SelectTrigger className="w-40">
          <SelectValue>
            {languages.find(lang => lang.code === language)?.flag} {languages.find(lang => lang.code === language)?.name}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              <span className="flex items-center space-x-2">
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};