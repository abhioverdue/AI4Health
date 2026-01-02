import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { translationService, Language } from '../services/translationService';

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (text: string) => string;
  isTranslating: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

interface TranslationProviderProps {
  children: ReactNode;
  initialLanguage?: Language;
  language?: Language;
}

export function TranslationProvider({ children, initialLanguage = 'en', language: externalLanguage }: TranslationProviderProps) {
  const [language, setLanguageState] = useState<Language>(externalLanguage || initialLanguage);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isTranslating, setIsTranslating] = useState(false);

  // Update language when external prop changes
  useEffect(() => {
    if (externalLanguage && externalLanguage !== language) {
      setLanguage(externalLanguage);
    }
  }, [externalLanguage]);

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    
    // Pre-cache common phrases when language changes
    if (lang !== 'en') {
      setIsTranslating(true);
      try {
        await translationService.preCacheCommonPhrases(lang);
      } catch (error) {
        console.error('Error pre-caching translations:', error);
      } finally {
        setIsTranslating(false);
      }
    }
  };

  const t = (text: string): string => {
    if (!text) return '';
    if (language === 'en') return text;
    
    // Return from cache if available
    return translations[text] || text;
  };

  // Effect to translate texts dynamically
  useEffect(() => {
    const textsToTranslate = new Set<string>();
    
    // Collect all texts that need translation
    const collectTexts = (node: Element) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent?.trim();
        if (text && text.length > 0) {
          textsToTranslate.add(text);
        }
      }
      node.childNodes.forEach(child => {
        if (child.nodeType === Node.ELEMENT_NODE) {
          collectTexts(child as Element);
        }
      });
    };

    // Only auto-collect if we're not in English mode
    if (language !== 'en' && typeof document !== 'undefined') {
      // Note: We don't auto-collect from DOM as it's too aggressive
      // Instead, components should explicitly request translations
    }
  }, [language]);

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t, isTranslating }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within TranslationProvider');
  }
  return context;
}

// Hook for translating dynamic content
export function useTranslate(text: string, deps: any[] = []): string {
  const { language } = useTranslation();
  const [translated, setTranslated] = useState(text);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (language === 'en') {
      setTranslated(text);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    translationService.translate(text, language)
      .then(result => {
        if (isMounted) {
          setTranslated(result);
        }
      })
      .catch(error => {
        console.error('Translation error:', error);
        if (isMounted) {
          setTranslated(text); // Fallback to original
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [text, language, ...deps]);

  return translated;
}

// Hook for translating multiple texts at once
export function useTranslateMultiple(texts: string[]): Record<string, string> {
  const { language } = useTranslation();
  const [translations, setTranslations] = useState<Record<string, string>>({});

  useEffect(() => {
    if (language === 'en') {
      const englishMap: Record<string, string> = {};
      texts.forEach(text => {
        englishMap[text] = text;
      });
      setTranslations(englishMap);
      return;
    }

    let isMounted = true;

    translationService.translateBatch(texts, language)
      .then(result => {
        if (isMounted) {
          setTranslations(result);
        }
      })
      .catch(error => {
        console.error('Batch translation error:', error);
        // Fallback to original texts
        if (isMounted) {
          const fallback: Record<string, string> = {};
          texts.forEach(text => {
            fallback[text] = text;
          });
          setTranslations(fallback);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [texts.join('|'), language]);

  return translations;
}