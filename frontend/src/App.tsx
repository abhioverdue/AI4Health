import { useState, useEffect } from 'react';
import { Onboarding } from './components/Onboarding';
import { HomeDashboard } from './components/HomeDashboard';
import { SymptomInput } from './components/SymptomInput';
import { ImageUpload } from './components/ImageUpload';
import { AIAnalysis } from './components/AIAnalysis';
import { ResultsTriage } from './components/ResultsTriage';
import { CareRecommendation } from './components/CareRecommendation';
import { DispatchFlow } from './components/DispatchFlow';
import { MedicView } from './components/MedicView';
import { HealthWorkerView } from './components/HealthWorkerView';
import { History } from './components/History';
import { TranslationProvider } from './hooks/useTranslation';
import { Language as TranslationLanguage } from './services/translationService';
import { TranslationLoadingIndicator } from './components/TranslationLoadingIndicator';

export type UserRole = 'patient' | 'health-worker' | 'medic';
export type Language = 'english' | 'hindi' | 'tamil' | 'telugu' | 'bengali' | 'marathi';
export type Screen = 
  | 'onboarding' 
  | 'home' 
  | 'symptom-input' 
  | 'image-upload' 
  | 'ai-analysis' 
  | 'results' 
  | 'care-recommendation'
  | 'dispatch'
  | 'medic-view'
  | 'health-worker-view'
  | 'history';

export interface AppState {
  currentScreen: Screen;
  userRole: UserRole | null;
  language: Language;
  isOnline: boolean;
  symptomData: {
    text?: string;
    voice?: boolean;
  };
  imageData: {
    url?: string;
    type?: 'wound' | 'skin' | 'xray';
  };
  analysisResult?: {
    riskLevel: 'low' | 'medium' | 'high';
    conditions: string[];
  };
  caseId?: string;
}

export default function App() {
  const [appState, setAppState] = useState<AppState>({
    currentScreen: 'onboarding',
    userRole: null,
    language: 'english',
    isOnline: true,
    symptomData: {},
    imageData: {},
  });

  // Simulate online/offline status
  useEffect(() => {
    const interval = setInterval(() => {
      setAppState(prev => ({
        ...prev,
        isOnline: Math.random() > 0.1, // Mostly online but occasional offline
      }));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const navigateTo = (screen: Screen) => {
    setAppState(prev => ({ ...prev, currentScreen: screen }));
  };

  const setUserRole = (role: UserRole) => {
    setAppState(prev => ({ ...prev, userRole: role }));
  };

  const setLanguage = (language: Language) => {
    setAppState(prev => ({ ...prev, language }));
  };

  // Convert app language to translation service language
  const getTranslationLanguage = (lang: Language): TranslationLanguage => {
    const mapping: Record<Language, TranslationLanguage> = {
      'english': 'en',
      'hindi': 'hi',
      'tamil': 'ta',
      'telugu': 'te',
      'bengali': 'bn',
      'marathi': 'mr',
    };
    return mapping[lang];
  };

  const updateSymptomData = (data: Partial<AppState['symptomData']>) => {
    setAppState(prev => ({
      ...prev,
      symptomData: { ...prev.symptomData, ...data },
    }));
  };

  const updateImageData = (data: Partial<AppState['imageData']>) => {
    setAppState(prev => ({
      ...prev,
      imageData: { ...prev.imageData, ...data },
    }));
  };

  const setAnalysisResult = (result: AppState['analysisResult']) => {
    setAppState(prev => ({ ...prev, analysisResult: result }));
  };

  const renderScreen = () => {
    switch (appState.currentScreen) {
      case 'onboarding':
        return (
          <Onboarding
            onComplete={(role, language) => {
              setUserRole(role);
              setLanguage(language);
              if (role === 'medic') {
                navigateTo('medic-view');
              } else if (role === 'health-worker') {
                navigateTo('health-worker-view');
              } else {
                navigateTo('home');
              }
            }}
          />
        );
      case 'home':
        return (
          <HomeDashboard
            userRole={appState.userRole!}
            language={appState.language}
            isOnline={appState.isOnline}
            onNavigate={navigateTo}
            onLanguageChange={setLanguage}
          />
        );
      case 'symptom-input':
        return (
          <SymptomInput
            language={appState.language}
            isOnline={appState.isOnline}
            onSubmit={(data) => {
              updateSymptomData(data);
              navigateTo('ai-analysis');
            }}
            onBack={() => navigateTo('home')}
          />
        );
      case 'image-upload':
        return (
          <ImageUpload
            language={appState.language}
            isOnline={appState.isOnline}
            onUpload={(data) => {
              updateImageData(data);
              navigateTo('ai-analysis');
            }}
            onBack={() => navigateTo('home')}
          />
        );
      case 'ai-analysis':
        return (
          <AIAnalysis
            language={appState.language}
            onComplete={(result) => {
              setAnalysisResult(result);
              navigateTo('results');
            }}
          />
        );
      case 'results':
        return (
          <ResultsTriage
            language={appState.language}
            result={appState.analysisResult!}
            onNext={() => navigateTo('care-recommendation')}
            onBack={() => navigateTo('home')}
          />
        );
      case 'care-recommendation':
        return (
          <CareRecommendation
            language={appState.language}
            riskLevel={appState.analysisResult?.riskLevel || 'low'}
            onSelectDispatch={() => navigateTo('dispatch')}
            onBack={() => navigateTo('results')}
          />
        );
      case 'dispatch':
        return (
          <DispatchFlow
            language={appState.language}
            isOnline={appState.isOnline}
            onComplete={() => navigateTo('home')}
          />
        );
      case 'medic-view':
        return (
          <MedicView
            language={appState.language}
            isOnline={appState.isOnline}
            onNavigate={navigateTo}
          />
        );
      case 'health-worker-view':
        return (
          <HealthWorkerView
            language={appState.language}
            isOnline={appState.isOnline}
            onNavigate={navigateTo}
          />
        );
      case 'history':
        return (
          <History
            language={appState.language}
            userRole={appState.userRole!}
            onBack={() => navigateTo('home')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <TranslationProvider language={getTranslationLanguage(appState.language)}>
      <TranslationLoadingIndicator />
      <div className="min-h-screen bg-gradient-to-b from-teal-50 to-orange-50">
        <div className="max-w-md mx-auto min-h-screen bg-white shadow-xl">
          {renderScreen()}
        </div>
      </div>
    </TranslationProvider>
  );
}