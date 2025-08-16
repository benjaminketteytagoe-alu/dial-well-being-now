// @ts-nocheck
import { Heart, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { language, t } = useLanguage();

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Globe, href: '#', label: 'Website' }
  ];

  const quickLinks = [
    { href: '/symptom-checker', label: t('footer.symptomChecker') },
    { href: '/book-doctor', label: t('footer.bookDoctor') },
    { href: '/menstrual-cycle', label: t('footer.menstrualTracking') },
    { href: '/health-plan', label: t('footer.healthPlan') },
    { href: '/community', label: t('footer.community') },
    { href: '/ussd', label: t('footer.ussdService') }
  ];

  const supportLinks = [
    { href: '/help', label: t('footer.helpCenter') },
    { href: '/privacy', label: t('footer.privacy') },
    { href: '/terms', label: t('footer.terms') },
    { href: '/contact', label: t('footer.contact') }
  ];

  return (
    <footer className="bg-gradient-to-r from-primary via-primary-foreground to-secondary text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* About NauriCare */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-accent" />
              <h3 className="text-xl font-bold">NauriCare</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {t('footer.aboutDescription')}
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">{t('footer.support')}</h4>
            <ul className="space-y-2">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="pt-4 space-y-2">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{t('footer.emergencyLine')}: 911</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{t('footer.helpline')}: 0800-NAURICARE</span>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">{t('footer.contactUs')}</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <MapPin className="h-5 w-5 text-accent mt-0.5" />
                <div className="text-muted-foreground">
                  <p>{t('footer.address.line1')}</p>
                  <p>{t('footer.address.line2')}</p>
                  <p>{t('footer.address.line3')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-accent" />
                <a
                  href="mailto:info@nauricare.com"
                  className="text-muted-foreground hover:text-white transition-colors"
                >
                  info@nauricare.com
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-accent" />
                <span className="text-muted-foreground">+254 700 000 000</span>
              </div>
            </div>
          </div>
        </div>

        {/* Coverage Areas */}
        <div className="border-t border-white/20 mt-8 pt-8">
          <h4 className="text-lg font-semibold mb-4 text-center">{t('footer.serviceAreas')}</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div className="p-3 bg-white/10 rounded-lg">
              <p className="font-medium">Kenya</p>
              <p className="text-sm text-muted-foreground">{t('footer.active')}</p>
            </div>
            <div className="p-3 bg-white/10 rounded-lg">
              <p className="font-medium">Tanzania</p>
              <p className="text-sm text-muted-foreground">{t('footer.active')}</p>
            </div>
            <div className="p-3 bg-white/5 rounded-lg">
              <p className="font-medium">Uganda</p>
              <p className="text-sm text-muted-foreground">{t('footer.comingSoon')}</p>
            </div>
            <div className="p-3 bg-white/5 rounded-lg">
              <p className="font-medium">Nigeria</p>
              <p className="text-sm text-muted-foreground">{t('footer.comingSoon')}</p>
            </div>
            <div className="p-3 bg-white/5 rounded-lg">
              <p className="font-medium">Ethiopia</p>
              <p className="text-sm text-muted-foreground">{t('footer.comingSoon')}</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            &copy; 2024 NauriCare. {t('footer.rightsReserved')}
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-muted-foreground text-sm">{t('footer.availableIn')}</span>
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-accent" />
              <span className="text-sm">
                {language === 'en' ? 'English' : 
                 language === 'sw' ? 'Kiswahili' :
                 language === 'fr' ? 'Français' :
                 language === 'ha' ? 'Hausa' :
                 language === 'am' ? 'አማርኛ' : 'Yorùbá'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;