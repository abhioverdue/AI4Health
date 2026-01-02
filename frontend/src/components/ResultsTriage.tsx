import { AlertCircle, CheckCircle, AlertTriangle, ArrowLeft, ChevronRight, Info } from 'lucide-react';
import { Language } from '../App';

interface ResultsTriageProps {
  language: Language;
  result: {
    riskLevel: 'low' | 'medium' | 'high';
    conditions: string[];
  };
  onNext: () => void;
  onBack: () => void;
}

export function ResultsTriage({ language, result, onNext, onBack }: ResultsTriageProps) {
  const getRiskConfig = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low':
        return {
          icon: CheckCircle,
          color: 'green',
          bgGradient: 'from-green-400 to-green-500',
          bgLight: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-700',
          label: language === 'hindi' ? 'कम जोखिम' : 'Low Risk',
          message: language === 'hindi' 
            ? 'स्थिति गंभीर नहीं लगती' 
            : 'Condition appears manageable',
        };
      case 'medium':
        return {
          icon: AlertTriangle,
          color: 'yellow',
          bgGradient: 'from-yellow-400 to-orange-400',
          bgLight: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-800',
          label: language === 'hindi' ? 'मध्यम जोखिम' : 'Medium Risk',
          message: language === 'hindi'
            ? 'चिकित्सा सलाह की सिफारिश'
            : 'Medical advice recommended',
        };
      case 'high':
        return {
          icon: AlertCircle,
          color: 'red',
          bgGradient: 'from-red-400 to-red-500',
          bgLight: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-700',
          label: language === 'hindi' ? 'उच्च जोखिम' : 'High Risk',
          message: language === 'hindi'
            ? 'तुरंत चिकित्सा की आवश्यकता'
            : 'Immediate medical attention needed',
        };
    }
  };

  const config = getRiskConfig(result.riskLevel);
  const Icon = config.icon;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white px-6 py-4 flex items-center gap-4 shadow-sm">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <div className="flex-1">
          <h2 className="text-gray-800">Analysis Results</h2>
          <p className="text-sm text-gray-500">विश्लेषण परिणाम</p>
        </div>
      </div>

      <div className="flex-1 px-6 py-6 overflow-auto">
        {/* Risk level card */}
        <div className={`bg-gradient-to-br ${config.bgGradient} rounded-3xl p-6 text-white shadow-xl mb-6`}>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Icon className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <div className="text-sm opacity-90">Risk Level</div>
              <h3 className="text-white">{config.label}</h3>
            </div>
          </div>
          <p className="text-white/90">{config.message}</p>
        </div>

        {/* Possible conditions */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h3 className="text-gray-800 mb-4">Possible Conditions</h3>
          <div className="space-y-3">
            {result.conditions.map((condition, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl"
              >
                <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-teal-600 text-sm">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <div className="text-gray-800">{condition}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Important disclaimer */}
        <div className={`${config.bgLight} ${config.border} border rounded-2xl p-4 mb-6`}>
          <div className="flex gap-3">
            <Info className={`w-5 h-5 ${config.text} flex-shrink-0 mt-0.5`} />
            <div>
              <div className={`${config.text} mb-2`}>
                ⚠️ Important Disclaimer
              </div>
              <p className="text-sm text-gray-700">
                {language === 'hindi'
                  ? 'यह अंतिम निदान नहीं है। यह केवल मार्गदर्शन के लिए है। कृपया योग्य डॉक्टर से परामर्श लें।'
                  : 'This is not a final diagnosis. This is for guidance only. Please consult a qualified doctor.'}
              </p>
            </div>
          </div>
        </div>

        {/* AI explanation */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
          <div className="text-sm text-blue-800">
            <div className="font-medium mb-2">🧠 How we analyzed:</div>
            <ul className="text-blue-700 space-y-1">
              <li>• Symptom patterns matched with medical database</li>
              <li>• Image features analyzed using AI</li>
              <li>• Risk assessment based on severity indicators</li>
            </ul>
          </div>
        </div>

        {/* Next steps button */}
        <button
          onClick={onNext}
          className="w-full bg-gradient-to-r from-teal-500 to-green-500 text-white p-5 rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
        >
          <span>View Care Options</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
