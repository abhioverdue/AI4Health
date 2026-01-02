import { useState, useEffect } from 'react';
import { Mic, MicOff, ArrowLeft, ChevronRight } from 'lucide-react';
import { Language } from '../App';
import { VoiceWaveform } from './VoiceWaveform';

interface SymptomInputProps {
  language: Language;
  isOnline: boolean;
  onSubmit: (data: { text: string; voice: boolean }) => void;
  onBack: () => void;
}

export function SymptomInput({ language, isOnline, onSubmit, onBack }: SymptomInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [text, setText] = useState('');
  const [voiceText, setVoiceText] = useState('');

  // Example hints based on language
  const hints = language === 'hindi' 
    ? [
        'bukhar aur khansi 3 din se',
        'kaal se chest pain',
        'pet mein dard hai',
      ]
    : [
        'fever and cough for 3 days',
        'chest pain since yesterday',
        'stomach pain',
      ];

  const handleVoiceToggle = () => {
    if (!isListening) {
      setIsListening(true);
      // Simulate voice recognition
      setTimeout(() => {
        const simulatedText = hints[Math.floor(Math.random() * hints.length)];
        setVoiceText(simulatedText);
        setText(simulatedText);
        setIsListening(false);
      }, 3000);
    } else {
      setIsListening(false);
    }
  };

  const handleSubmit = () => {
    if (text.trim()) {
      onSubmit({ text: text.trim(), voice: !!voiceText });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-teal-50 flex flex-col">
      {/* Header */}
      <div className="bg-white px-6 py-4 flex items-center gap-4 shadow-sm">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <div className="flex-1">
          <h2 className="text-gray-800">Describe symptoms</h2>
          <p className="text-sm text-gray-500">लक्षण बताएं</p>
        </div>
      </div>

      <div className="flex-1 px-6 py-8 flex flex-col">
        {/* Voice button */}
        <div className="text-center mb-8">
          <button
            onClick={handleVoiceToggle}
            className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center shadow-xl transition-all active:scale-95 ${
              isListening
                ? 'bg-gradient-to-br from-red-500 to-red-600 animate-pulse'
                : 'bg-gradient-to-br from-teal-500 to-teal-600'
            }`}
          >
            {isListening ? (
              <MicOff className="w-16 h-16 text-white" />
            ) : (
              <Mic className="w-16 h-16 text-white" />
            )}
          </button>
          <p className="mt-4 text-gray-600">
            {isListening ? 'Listening...' : 'Tap to speak'}
          </p>
          <p className="text-sm text-gray-500">
            {isListening ? 'सुन रहे हैं...' : 'बोलने के लिए टैप करें'}
          </p>
        </div>

        {/* Waveform animation */}
        {isListening && (
          <div className="mb-8">
            <VoiceWaveform isActive={isListening} />
          </div>
        )}

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-sm text-gray-500">or type</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* Text input */}
        <div className="mb-6">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={language === 'hindi' 
              ? 'यहाँ टाइप करें...' 
              : 'Type here...'}
            className="w-full h-32 p-4 border-2 border-gray-200 rounded-2xl focus:border-teal-500 focus:outline-none resize-none"
          />
        </div>

        {/* Hint examples */}
        <div className="mb-8">
          <p className="text-sm text-gray-600 mb-3">Examples:</p>
          <div className="space-y-2">
            {hints.map((hint, index) => (
              <button
                key={index}
                onClick={() => setText(hint)}
                className="w-full text-left px-4 py-3 bg-teal-50 text-teal-700 rounded-xl text-sm hover:bg-teal-100 transition-colors"
              >
                "{hint}"
              </button>
            ))}
          </div>
        </div>

        {/* Offline notice */}
        {!isOnline && (
          <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-xl">
            <p className="text-sm text-orange-800">
              📡 You're offline. Your data will be analyzed when connection is restored.
            </p>
          </div>
        )}

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={!text.trim()}
          className="w-full bg-gradient-to-r from-teal-500 to-green-500 text-white p-5 rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
        >
          <span>Continue</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
