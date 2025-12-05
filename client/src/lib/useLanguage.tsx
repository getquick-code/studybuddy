import { useState, createContext, useContext, ReactNode } from 'react';
import { Language, getTranslation, Translations, languageNames } from './i18n';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  setLanguageFromUser: (lang: Language) => void;
  t: Translations;
  languageNames: typeof languageNames;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('nl');

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const setLanguageFromUser = (lang: Language) => {
    if (['nl', 'fr', 'en'].includes(lang)) {
      setLanguageState(lang);
    }
  };

  const t = getTranslation(language);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, setLanguageFromUser, t, languageNames }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
