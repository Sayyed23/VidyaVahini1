
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';

export const SimpleLanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  
  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode);
    
    // Log language change but don't toast
    console.log(`Language changed to ${langCode}`);
  };
  
  return (
    <div className="flex flex-wrap gap-2">
      <Button 
        variant={language === 'en' ? 'default' : 'outline'}
        size="sm" 
        onClick={() => handleLanguageChange('en')}
        className={language === 'en' ? 'bg-edu-purple text-white' : 'text-white hover:bg-edu-purple/20'}
      >
        English
      </Button>
      <Button 
        variant={language === 'hi' ? 'default' : 'outline'}
        size="sm" 
        onClick={() => handleLanguageChange('hi')}
        className={language === 'hi' ? 'bg-edu-purple text-white' : 'text-white hover:bg-edu-purple/20'}
      >
        Hindi
      </Button>
      <Button 
        variant={language === 'bn' ? 'default' : 'outline'}
        size="sm" 
        onClick={() => handleLanguageChange('bn')}
        className={language === 'bn' ? 'bg-edu-purple text-white' : 'text-white hover:bg-edu-purple/20'}
      >
        Bengali
      </Button>
      <Button 
        variant={language === 'ta' ? 'default' : 'outline'}
        size="sm" 
        onClick={() => handleLanguageChange('ta')}
        className={language === 'ta' ? 'bg-edu-purple text-white' : 'text-white hover:bg-edu-purple/20'}
      >
        Tamil
      </Button>
      <Button 
        variant={language === 'te' ? 'default' : 'outline'}
        size="sm" 
        onClick={() => handleLanguageChange('te')}
        className={language === 'te' ? 'bg-edu-purple text-white' : 'text-white hover:bg-edu-purple/20'}
      >
        Telugu
      </Button>
      <Button 
        variant={language === 'kn' ? 'default' : 'outline'}
        size="sm" 
        onClick={() => handleLanguageChange('kn')}
        className={language === 'kn' ? 'bg-edu-purple text-white' : 'text-white hover:bg-edu-purple/20'}
      >
        Kannada
      </Button>
    </div>
  );
};

export default SimpleLanguageSwitcher;
