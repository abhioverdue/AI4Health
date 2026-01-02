import { Phone, MapPin, AlertCircle, CheckSquare, Video, ArrowLeft } from 'lucide-react';
import { Language, Screen } from '../App';
import { useState } from 'react';

interface MedicViewProps {
  language: Language;
  isOnline: boolean;
  onNavigate: (screen: Screen) => void;
}

export function MedicView({ language, isOnline, onNavigate }: MedicViewProps) {
  const [checklist, setChecklist] = useState({
    ppe: false,
    consent: false,
    meds: false,
  });

  const activeCase = {
    id: 'CASE-2024-001',
    patientName: 'Patient #001',
    age: '45',
    gender: 'Male',
    location: 'Village Rampur, 3.2 km away',
    riskLevel: 'high' as const,
    symptoms: 'Severe chest pain, difficulty breathing',
    symptomsHi: 'गंभीर सीने में दर्द, सांस लेने में कठिनाई',
    aiHighlights: [
      'High priority - possible cardiac event',
      'Image shows skin discoloration',
      'Patient reports pain level 8/10',
    ],
  };

  const toggleChecklistItem = (item: keyof typeof checklist) => {
    setChecklist((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 pt-12 pb-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-white mb-1">Medic Dashboard</h1>
            <p className="text-sm text-white/80">मेडिक डैशबोर्ड</p>
          </div>
          <div
            className={`px-3 py-1 rounded-full flex items-center gap-2 text-xs ${
              isOnline ? 'bg-green-400/30' : 'bg-orange-400/30'
            }`}
          >
            {isOnline ? '🟢 Online' : '🔴 Offline'}
          </div>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-white/80">Active Cases</div>
              <div className="text-2xl text-white">1</div>
            </div>
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              🚑
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 -mt-4">
        {/* Patient Summary Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="text-sm text-gray-500 mb-1">Case ID: {activeCase.id}</div>
              <h2 className="text-gray-800 mb-2">{activeCase.patientName}</h2>
              <div className="flex gap-4 text-sm text-gray-600">
                <span>{activeCase.age} yrs</span>
                <span>•</span>
                <span>{activeCase.gender}</span>
              </div>
            </div>
            <div className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
              High Risk
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 mb-4 p-3 bg-blue-50 rounded-xl">
            <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <span className="text-sm text-blue-800">{activeCase.location}</span>
          </div>

          {/* Symptoms */}
          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-2">Reported Symptoms:</div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <div className="text-gray-800 mb-1">{activeCase.symptoms}</div>
              <div className="text-sm text-gray-500">{activeCase.symptomsHi}</div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-teal-500 text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-teal-600 transition-colors active:scale-[0.98]">
              <MapPin className="w-5 h-5" />
              <span className="text-sm">Navigate</span>
            </button>
            <button className="bg-blue-500 text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors active:scale-[0.98]">
              <Phone className="w-5 h-5" />
              <span className="text-sm">Call Patient</span>
            </button>
          </div>
        </div>

        {/* AI Highlights */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 mb-6 text-white">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              🧠
            </div>
            <h3 className="text-white">AI Analysis Highlights</h3>
          </div>
          <div className="space-y-3">
            {activeCase.aiHighlights.map((highlight, index) => (
              <div key={index} className="flex items-start gap-3 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-yellow-300" />
                <span className="text-white/90">{highlight}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pre-arrival Checklist */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h3 className="text-gray-800 mb-4">Pre-arrival Checklist</h3>
          <div className="space-y-3">
            <button
              onClick={() => toggleChecklistItem('ppe')}
              className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${
                checklist.ppe ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-50 border-2 border-gray-200'
              }`}
            >
              <div
                className={`w-6 h-6 rounded flex items-center justify-center ${
                  checklist.ppe ? 'bg-green-500' : 'bg-white border-2 border-gray-300'
                }`}
              >
                {checklist.ppe && <CheckSquare className="w-5 h-5 text-white" />}
              </div>
              <div className="text-left flex-1">
                <div className={`font-medium ${checklist.ppe ? 'text-green-800' : 'text-gray-700'}`}>
                  PPE Kit Ready
                </div>
                <div className={`text-sm ${checklist.ppe ? 'text-green-600' : 'text-gray-500'}`}>
                  Personal protective equipment
                </div>
              </div>
            </button>

            <button
              onClick={() => toggleChecklistItem('consent')}
              className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${
                checklist.consent ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-50 border-2 border-gray-200'
              }`}
            >
              <div
                className={`w-6 h-6 rounded flex items-center justify-center ${
                  checklist.consent ? 'bg-green-500' : 'bg-white border-2 border-gray-300'
                }`}
              >
                {checklist.consent && <CheckSquare className="w-5 h-5 text-white" />}
              </div>
              <div className="text-left flex-1">
                <div className={`font-medium ${checklist.consent ? 'text-green-800' : 'text-gray-700'}`}>
                  Consent Form
                </div>
                <div className={`text-sm ${checklist.consent ? 'text-green-600' : 'text-gray-500'}`}>
                  Patient consent verified
                </div>
              </div>
            </button>

            <button
              onClick={() => toggleChecklistItem('meds')}
              className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${
                checklist.meds ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-50 border-2 border-gray-200'
              }`}
            >
              <div
                className={`w-6 h-6 rounded flex items-center justify-center ${
                  checklist.meds ? 'bg-green-500' : 'bg-white border-2 border-gray-300'
                }`}
              >
                {checklist.meds && <CheckSquare className="w-5 h-5 text-white" />}
              </div>
              <div className="text-left flex-1">
                <div className={`font-medium ${checklist.meds ? 'text-green-800' : 'text-gray-700'}`}>
                  Emergency Meds
                </div>
                <div className={`text-sm ${checklist.meds ? 'text-green-600' : 'text-gray-500'}`}>
                  First-aid supplies checked
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Teleconsult button */}
        <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white p-5 rounded-2xl flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all active:scale-[0.98] mb-6">
          <Video className="w-6 h-6" />
          <div className="text-left">
            <div className="font-medium">Connect to Doctor</div>
            <div className="text-sm text-blue-100">One-tap teleconsult</div>
          </div>
        </button>

        {/* Emergency contacts */}
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
          <div className="text-sm text-orange-800 font-medium mb-2">🆘 Emergency Support</div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-orange-700">
              <span>Emergency Coordinator</span>
              <span className="font-medium">108</span>
            </div>
            <div className="flex justify-between text-orange-700">
              <span>Hospital Direct</span>
              <span className="font-medium">+91 1234 567890</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
