import { Mic, Camera, Upload, MapPin, History as HistoryIcon, Wifi, WifiOff, Globe } from 'lucide-react';
import { UserRole, Language, Screen } from '../App';
import { Icon3DClinic } from './3d-icons/Icon3DClinic';
import { LanguageSelector } from './LanguageSelector';
import { useTranslate, useTranslateMultiple } from '../hooks/useTranslation';

interface HomeDashboardProps {
  userRole: UserRole;
  language: Language;
  isOnline: boolean;
  onNavigate: (screen: Screen) => void;
  onLanguageChange?: (language: Language) => void;
}

export function HomeDashboard({ userRole, language, isOnline, onNavigate, onLanguageChange }: HomeDashboardProps) {
  // Translate key texts
  const greeting = useTranslate('Hello');
  const speakProblem = useTranslate('Speak your problem');
  const takePhoto = useTranslate('Take a photo');
  const uploadReport = useTranslate('Upload report');
  const findCare = useTranslate('Find care');
  const viewHistory = useTranslate('View History');
  const quickTip = useTranslate('Quick Tip');
  const tipText = useTranslate('You can speak in mixed languages - we understand!');
  const howHelp = useTranslate('How can we help?');
  const online = useTranslate('Online');
  const offline = useTranslate('Offline');
  
  const roleLabel = 
    userRole === 'patient' ? useTranslate('Patient') :
    userRole === 'health-worker' ? useTranslate('Health Worker') : 
    useTranslate('Medic');

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-green-500 px-6 pt-12 pb-8 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-white/80 text-sm">{greeting}</div>
            <h1 className="text-white">AI4Health</h1>
          </div>
          <div className="flex items-center gap-3">
            {/* Language toggle */}
            {onLanguageChange && (
              <LanguageSelector 
                currentLanguage={language}
                onLanguageChange={onLanguageChange}
              />
            )}
            {/* Online status */}
            <div className={`px-3 py-1 rounded-full flex items-center gap-2 text-xs ${
              isOnline ? 'bg-green-400/30 text-white' : 'bg-orange-400/30 text-white'
            }`}>
              {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              {isOnline ? online : offline}
            </div>
          </div>
        </div>
        <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm">
          {roleLabel}
        </div>
      </div>

      <div className="px-6 -mt-4">
        {/* Primary Actions */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="mb-4 text-gray-700">{howHelp}</h2>
          
          <div className="space-y-3">
            {/* Voice input */}
            <button
              onClick={() => onNavigate('symptom-input')}
              className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white p-6 rounded-2xl flex items-center gap-4 shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
            >
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0">
                <Mic className="w-7 h-7" />
              </div>
              <div className="text-left flex-1">
                <div className="font-medium">{speakProblem}</div>
              </div>
            </button>

            {/* Camera */}
            <button
              onClick={() => onNavigate('image-upload')}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-2xl flex items-center gap-4 shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
            >
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0">
                <Camera className="w-7 h-7" />
              </div>
              <div className="text-left flex-1">
                <div className="font-medium">{takePhoto}</div>
              </div>
            </button>
          </div>
        </div>

        {/* Secondary Actions */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button className="bg-white rounded-2xl shadow-md p-5 flex flex-col items-center gap-3 hover:shadow-lg transition-all active:scale-[0.98]">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <Upload className="w-6 h-6 text-orange-600" />
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-700">{uploadReport}</div>
            </div>
          </button>

          <button className="bg-white rounded-2xl shadow-md p-5 flex flex-col items-center gap-3 hover:shadow-lg transition-all active:scale-[0.98]">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-700">{findCare}</div>
            </div>
          </button>
        </div>

        {/* Illustration */}
        <div className="flex justify-center mb-6">
          <Icon3DClinic size={240} />
        </div>

        {/* History button */}
        {userRole !== 'medic' && (
          <button
            onClick={() => onNavigate('history')}
            className="w-full bg-gray-100 text-gray-700 p-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-all mb-6"
          >
            <HistoryIcon className="w-5 h-5" />
            <span>{viewHistory}</span>
          </button>
        )}

        {/* Info card */}
        <div className="bg-teal-50 border border-teal-100 rounded-2xl p-4 mb-6">
          <div className="text-sm text-teal-800">
            <div className="font-medium mb-1">💡 {quickTip}</div>
            <div className="text-teal-700">
              {tipText}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}