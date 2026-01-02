import { useState } from 'react';
import { Globe, Check, X } from 'lucide-react';
import { Language } from '../App';

interface LanguageSelectorProps {
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

export function LanguageSelector({ currentLanguage, onLanguageChange }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const languages: { code: Language; name: string; nativeName: string }[] = [
    { code: 'english', name: 'English', nativeName: 'English' },
    { code: 'hindi', name: 'Hindi', nativeName: 'हिंदी' },
    { code: 'tamil', name: 'Tamil', nativeName: 'தமிழ்' },
  ];

  const currentLangData = languages.find(l => l.code === currentLanguage);

  const handleLanguageSelect = (lang: Language) => {
    onLanguageChange(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors active:scale-95"
        aria-label="Select Language"
      >
        <Globe className="w-5 h-5" />
      </button>

      {/* Dropdown Modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl z-50 w-[90%] max-w-sm max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-500 to-green-500 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-white">Select Language</h3>
                <p className="text-white/80 text-sm">भाषा चुनें</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Language List */}
            <div className="overflow-y-auto max-h-[60vh]">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageSelect(lang.code)}
                  className={`w-full px-6 py-4 flex items-center justify-between hover:bg-teal-50 transition-colors border-b border-gray-100 ${
                    currentLanguage === lang.code ? 'bg-teal-50' : ''
                  }`}
                >
                  <div className="text-left">
                    <div className="text-gray-800 font-medium">{lang.name}</div>
                    <div className="text-gray-600 text-sm">{lang.nativeName}</div>
                  </div>
                  {currentLanguage === lang.code && (
                    <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Info Footer */}
            <div className="px-6 py-4 bg-blue-50 border-t border-blue-100">
              <div className="flex items-start gap-3">
                <div className="text-2xl flex-shrink-0">🌐</div>
                <div>
                  <p className="text-sm text-blue-800 mb-1">
                    Real-time Translation
                  </p>
                  <p className="text-xs text-blue-600">
                    Content will be automatically translated using AI. Some translations may take a moment to load.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
