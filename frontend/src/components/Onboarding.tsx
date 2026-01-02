import { useState } from 'react';
import { ChevronRight, Check } from 'lucide-react';
import { UserRole, Language } from '../App';
import { Icon3DVoice } from './3d-icons/Icon3DVoice';
import { Icon3DPrivacy } from './3d-icons/Icon3DPrivacy';

interface OnboardingProps {
  onComplete: (role: UserRole, language: Language) => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('english');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [consentGiven, setConsentGiven] = useState(false);

  const languages: { value: Language; label: string; native: string }[] = [
    { value: 'english', label: 'English', native: 'English' },
    { value: 'hindi', label: 'Hindi', native: 'हिंदी' },
    { value: 'tamil', label: 'Tamil', native: 'தமிழ்' },
  ];

  const roles: { value: UserRole; label: string; description: string; icon: string }[] = [
    { value: 'patient', label: 'Patient / Caregiver', description: 'Get health advice', icon: '🤒' },
    { value: 'health-worker', label: 'Health Worker (ASHA/CHW)', description: 'Support community', icon: '👩‍⚕️' },
    { value: 'medic', label: 'Medic Team', description: 'Respond to emergencies', icon: '🚑' },
  ];

  const handleComplete = () => {
    if (selectedRole && consentGiven) {
      onComplete(selectedRole, selectedLanguage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-400 to-green-500 p-6 flex flex-col">
      {/* Progress dots */}
      <div className="flex justify-center gap-2 mb-8 pt-4">
        {[1, 2, 3].map((dot) => (
          <div
            key={dot}
            className={`h-2 rounded-full transition-all ${
              dot === step
                ? 'w-8 bg-white'
                : dot < step
                ? 'w-2 bg-white/80'
                : 'w-2 bg-white/30'
            }`}
          />
        ))}
      </div>

      {/* Step 1: Language Selection */}
      {step === 1 && (
        <div className="flex-1 flex flex-col">
          <div className="text-center mb-8">
            <div className="mb-6 flex justify-center">
              <Icon3DVoice size={120} />
            </div>
            <h1 className="text-white mb-2">Welcome to AI4Health</h1>
            <p className="text-white/90">Choose your language</p>
            <p className="text-white/90">अपनी भाषा चुनें</p>
          </div>

          <div className="flex-1 space-y-3">
            {languages.map((lang) => (
              <button
                key={lang.value}
                onClick={() => setSelectedLanguage(lang.value)}
                className={`w-full p-5 rounded-2xl flex items-center justify-between transition-all ${
                  selectedLanguage === lang.value
                    ? 'bg-white text-teal-600 shadow-lg scale-[1.02]'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <div className="text-left">
                  <div className="font-medium">{lang.native}</div>
                  <div className="text-sm opacity-80">{lang.label}</div>
                </div>
                {selectedLanguage === lang.value && (
                  <Check className="w-6 h-6" />
                )}
              </button>
            ))}
            
            <button className="w-full p-5 rounded-2xl bg-white/10 text-white border-2 border-white/30 border-dashed">
              + More languages
            </button>
          </div>

          <button
            onClick={() => setStep(2)}
            className="w-full mt-6 bg-white text-teal-600 p-5 rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
          >
            Continue
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Step 2: Role Selection */}
      {step === 2 && (
        <div className="flex-1 flex flex-col">
          <div className="text-center mb-8">
            <h2 className="text-white mb-2">I am a...</h2>
            <p className="text-white/80">मैं हूँ...</p>
          </div>

          <div className="flex-1 space-y-4">
            {roles.map((role) => (
              <button
                key={role.value}
                onClick={() => setSelectedRole(role.value)}
                className={`w-full p-6 rounded-2xl transition-all ${
                  selectedRole === role.value
                    ? 'bg-white text-teal-600 shadow-lg scale-[1.02]'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{role.icon}</div>
                  <div className="flex-1 text-left">
                    <div className="font-medium mb-1">{role.label}</div>
                    <div className="text-sm opacity-80">{role.description}</div>
                  </div>
                  {selectedRole === role.value && (
                    <Check className="w-6 h-6 flex-shrink-0" />
                  )}
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={() => setStep(3)}
            disabled={!selectedRole}
            className="w-full mt-6 bg-white text-teal-600 p-5 rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Step 3: Consent & Privacy */}
      {step === 3 && (
        <div className="flex-1 flex flex-col">
          <div className="text-center mb-8">
            <div className="mb-6 flex justify-center">
              <Icon3DPrivacy size={100} />
            </div>
            <h2 className="text-white mb-2">Privacy & Consent</h2>
            <p className="text-white/80 text-sm">गोपनीयता और सहमति</p>
          </div>

          <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-6 overflow-auto">
            <div className="text-white space-y-4 text-sm">
              <div>
                <div className="font-medium mb-2">✓ Your data is secure</div>
                <p className="text-white/80">All health information is encrypted and stored safely.</p>
              </div>
              
              <div>
                <div className="font-medium mb-2">✓ Not a replacement for doctors</div>
                <p className="text-white/80">This app provides guidance only. Always consult qualified medical professionals.</p>
              </div>
              
              <div>
                <div className="font-medium mb-2">✓ Works offline</div>
                <p className="text-white/80">Basic features work without internet. Data syncs when online.</p>
              </div>
              
              <div>
                <div className="font-medium mb-2">✓ Free to use</div>
                <p className="text-white/80">No charges for app features. Medical services may have separate costs.</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setConsentGiven(!consentGiven)}
            className={`w-full p-5 rounded-2xl flex items-center gap-4 mb-4 transition-all ${
              consentGiven
                ? 'bg-white text-teal-600 shadow-lg'
                : 'bg-white/20 text-white border-2 border-white/30'
            }`}
          >
            <div
              className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 ${
                consentGiven ? 'bg-teal-600 text-white' : 'bg-white/30'
              }`}
            >
              {consentGiven && <Check className="w-4 h-4" />}
            </div>
            <div className="text-left text-sm">
              I understand and agree to the privacy policy
            </div>
          </button>

          <button
            onClick={handleComplete}
            disabled={!consentGiven}
            className="w-full bg-white text-teal-600 p-5 rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Get Started
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
