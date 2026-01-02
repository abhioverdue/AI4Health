import { useState, useEffect } from 'react';
import { ArrowLeft, Check, MapPin, Phone, User } from 'lucide-react';
import { Language } from '../App';
import { Icon3DNavigation } from './3d-icons/Icon3DNavigation';

interface DispatchFlowProps {
  language: Language;
  isOnline: boolean;
  onComplete: () => void;
}

type DispatchStatus = 'requesting' | 'assigned' | 'enroute' | 'arrived';

export function DispatchFlow({ language, isOnline, onComplete }: DispatchFlowProps) {
  const [status, setStatus] = useState<DispatchStatus>('requesting');
  const [eta, setEta] = useState(25);

  const statusSteps: { status: DispatchStatus; label: string; labelHi: string }[] = [
    { status: 'requesting', label: 'Request sent', labelHi: 'अनुरोध भेजा गया' },
    { status: 'assigned', label: 'Medic assigned', labelHi: 'मेडिक नियुक्त' },
    { status: 'enroute', label: 'En route', labelHi: 'रास्ते में' },
    { status: 'arrived', label: 'Arrived', labelHi: 'पहुंच गया' },
  ];

  useEffect(() => {
    // Simulate status progression
    const timer1 = setTimeout(() => setStatus('assigned'), 2000);
    const timer2 = setTimeout(() => setStatus('enroute'), 4000);
    const timer3 = setTimeout(() => setStatus('arrived'), 15000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  useEffect(() => {
    // Countdown ETA
    if (status === 'enroute') {
      const interval = setInterval(() => {
        setEta((prev) => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [status]);

  const getCurrentStepIndex = () => {
    return statusSteps.findIndex((step) => step.status === status);
  };

  const medicInfo = {
    name: 'Dr. Rajesh Kumar',
    role: 'Emergency Medical Technician',
    roleHi: 'आपातकालीन चिकित्सा तकनीशियन',
    phone: '+91 98765 43210',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 text-white shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={onComplete}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h2 className="text-white">Medic Dispatch</h2>
            <p className="text-sm text-white/80">मेडिक भेजना</p>
          </div>
        </div>

        {/* Status badge */}
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
          <div className="text-center">
            <div className="text-sm text-white/80 mb-1">Status</div>
            <div className="text-white">
              {statusSteps[getCurrentStepIndex()].label}
            </div>
            <div className="text-sm text-white/80">
              {statusSteps[getCurrentStepIndex()].labelHi}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 px-6 py-6 overflow-auto">
        {/* Timeline */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h3 className="text-gray-800 mb-6">Progress</h3>
          <div className="space-y-6">
            {statusSteps.map((step, index) => {
              const currentIndex = getCurrentStepIndex();
              const isCompleted = index <= currentIndex;
              const isCurrent = index === currentIndex;

              return (
                <div key={step.status} className="flex gap-4">
                  {/* Timeline dot */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isCompleted
                          ? 'bg-gradient-to-br from-teal-500 to-green-500 text-white shadow-lg'
                          : 'bg-gray-200 text-gray-400'
                      } ${isCurrent ? 'ring-4 ring-teal-100' : ''}`}
                    >
                      {isCompleted && <Check className="w-5 h-5" />}
                      {!isCompleted && <span className="text-sm">{index + 1}</span>}
                    </div>
                    {index < statusSteps.length - 1 && (
                      <div
                        className={`w-0.5 h-12 mt-2 transition-all ${
                          isCompleted ? 'bg-teal-500' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>

                  {/* Step info */}
                  <div className="flex-1 pb-4">
                    <div
                      className={`font-medium mb-1 ${
                        isCompleted ? 'text-gray-800' : 'text-gray-400'
                      }`}
                    >
                      {step.label}
                    </div>
                    <div
                      className={`text-sm ${
                        isCompleted ? 'text-gray-500' : 'text-gray-400'
                      }`}
                    >
                      {step.labelHi}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ETA Card */}
        {status === 'enroute' && (
          <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl p-6 text-white shadow-xl mb-6">
            <div className="text-center mb-4">
              <div className="text-sm text-white/80 mb-2">Estimated Time of Arrival</div>
              <div className="text-5xl mb-2">
                {Math.floor(eta / 60)}:{(eta % 60).toString().padStart(2, '0')}
              </div>
              <div className="text-white/90">minutes</div>
            </div>
          </div>
        )}

        {/* Map placeholder */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-6">
          <div className="h-48 bg-gradient-to-br from-teal-100 to-blue-100 relative flex items-center justify-center">
            <Icon3DNavigation size={120} />
            {status === 'enroute' && (
              <div className="absolute top-4 left-4 bg-white rounded-lg px-3 py-2 shadow-md flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-gray-700">Tracking live</span>
              </div>
            )}
          </div>
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-teal-500" />
              <span>Distance: ~3.2 km</span>
            </div>
          </div>
        </div>

        {/* Medic info */}
        {(status === 'assigned' || status === 'enroute' || status === 'arrived') && (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <h3 className="text-gray-800 mb-4">Your Medic</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-500 rounded-full flex items-center justify-center text-white">
                <User className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <div className="text-gray-800 font-medium mb-1">{medicInfo.name}</div>
                <div className="text-sm text-gray-500">{medicInfo.role}</div>
                <div className="text-xs text-gray-500">{medicInfo.roleHi}</div>
              </div>
            </div>
            <button className="w-full bg-teal-500 text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-teal-600 transition-colors active:scale-[0.98]">
              <Phone className="w-5 h-5" />
              <span>Call Medic</span>
            </button>
          </div>
        )}

        {/* Arrived message */}
        {status === 'arrived' && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6">
            <div className="text-center">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-green-800 mb-2">Medic has arrived!</h3>
              <p className="text-sm text-green-700">
                {language === 'hindi'
                  ? 'मेडिक आपके स्थान पर पहुंच गया है'
                  : 'The medic has reached your location'}
              </p>
            </div>
          </div>
        )}

        {/* Offline fallback */}
        {!isOnline && (
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
            <div className="flex gap-3">
              <div className="text-2xl">📡</div>
              <div className="flex-1">
                <div className="text-orange-800 font-medium mb-1">
                  Offline Mode
                </div>
                <p className="text-sm text-orange-700">
                  {language === 'hindi'
                    ? 'कनेक्शन बहाल होने पर स्थिति अपडेट होगी'
                    : 'Status will update when connection is restored'}
                </p>
                <div className="mt-3 text-sm text-orange-800">
                  <div className="font-medium mb-1">Alternative steps:</div>
                  <ul className="space-y-1 text-orange-700">
                    <li>• Call 108 for emergency</li>
                    <li>• Go to nearest health center</li>
                    <li>• Ask community health worker</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
