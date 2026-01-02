import { ArrowLeft, MapPin, Navigation, Clock, Phone } from 'lucide-react';
import { Language } from '../App';
import { Icon3DFacility } from './3d-icons/Icon3DFacility';
import { Icon3DMedicDispatch } from './3d-icons/Icon3DMedicDispatch';

interface CareRecommendationProps {
  language: Language;
  riskLevel: 'low' | 'medium' | 'high';
  onSelectDispatch: () => void;
  onBack: () => void;
}

export function CareRecommendation({ language, riskLevel, onSelectDispatch, onBack }: CareRecommendationProps) {
  const isUrgent = riskLevel === 'high';

  const facilities = [
    {
      name: 'Primary Health Centre',
      nameHi: 'प्राथमिक स्वास्थ्य केंद्र',
      distance: '2.3 km',
      eta: '15 min',
      available: true,
    },
    {
      name: 'Community Health Centre',
      nameHi: 'सामुदायिक स्वास्थ्य केंद्र',
      distance: '5.8 km',
      eta: '25 min',
      available: true,
    },
    {
      name: 'District Hospital',
      nameHi: 'जिला अस्पताल',
      distance: '12.5 km',
      eta: '45 min',
      available: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white px-6 py-4 flex items-center gap-4 shadow-sm">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <div className="flex-1">
          <h2 className="text-gray-800">Care Options</h2>
          <p className="text-sm text-gray-500">देखभाल विकल्प</p>
        </div>
      </div>

      <div className="flex-1 px-6 py-6 overflow-auto">
        {/* Urgent dispatch option */}
        {isUrgent && (
          <div className="mb-6">
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-3xl p-6 text-white shadow-xl mb-3">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16">
                  <Icon3DMedicDispatch size={64} />
                </div>
                <div className="flex-1">
                  <div className="text-sm opacity-90">Recommended</div>
                  <h3 className="text-white">Request Medic Team</h3>
                </div>
              </div>
              <p className="text-white/90 mb-4">
                {language === 'hindi'
                  ? 'तत्काल चिकित्सा सहायता की आवश्यकता - एक मेडिक टीम भेजें'
                  : 'Immediate medical assistance needed - dispatch a medic team'}
              </p>
              <button
                onClick={onSelectDispatch}
                className="w-full bg-white text-red-600 p-4 rounded-xl font-medium hover:shadow-lg transition-all active:scale-[0.98]"
              >
                🚑 Request Now
              </button>
            </div>
            
            <div className="flex items-center gap-2 mb-6">
              <div className="flex-1 h-px bg-gray-300" />
              <span className="text-sm text-gray-500">or visit facility</span>
              <div className="flex-1 h-px bg-gray-300" />
            </div>
          </div>
        )}

        {/* Why this option */}
        {!isUrgent && (
          <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 mb-6">
            <div className="flex gap-3">
              <div className="w-10 h-10">
                <Icon3DFacility size={40} />
              </div>
              <div className="flex-1">
                <div className="text-teal-800 font-medium mb-1">
                  {language === 'hindi' ? 'सुझाव' : 'Suggestion'}
                </div>
                <p className="text-sm text-teal-700">
                  {riskLevel === 'low'
                    ? language === 'hindi'
                      ? 'नजदीकी स्वास्थ्य केंद्र पर जाएं या घर पर देखभाल करें'
                      : 'Visit nearby health center or manage with home care'
                    : language === 'hindi'
                    ? 'चिकित्सा परामर्श के लिए स्वास्थ्य सुविधा पर जाएं'
                    : 'Visit health facility for medical consultation'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Nearby facilities */}
        <div className="mb-6">
          <h3 className="text-gray-800 mb-4">Nearby Health Facilities</h3>
          <div className="space-y-3">
            {facilities.map((facility, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="text-gray-800 mb-1">{facility.name}</h4>
                      <p className="text-sm text-gray-500">{facility.nameHi}</p>
                    </div>
                    {facility.available && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        Open
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-teal-500" />
                      <span>{facility.distance}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-orange-500" />
                      <span>{facility.eta}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 bg-teal-500 text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-teal-600 transition-colors active:scale-[0.98]">
                      <Navigation className="w-4 h-4" />
                      <span className="text-sm">Navigate</span>
                    </button>
                    <button className="px-4 bg-gray-100 text-gray-700 py-3 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors active:scale-[0.98]">
                      <Phone className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency contact */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Phone className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1">
              <div className="text-sm text-red-600 font-medium">Emergency</div>
              <div className="text-red-700">Call 108 (Ambulance)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
