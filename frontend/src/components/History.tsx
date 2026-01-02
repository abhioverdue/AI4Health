import { ArrowLeft, Calendar, Download, Share2, Eye } from 'lucide-react';
import { Language, UserRole } from '../App';
import { useState } from 'react';

interface HistoryProps {
  language: Language;
  userRole: UserRole;
  onBack: () => void;
}

export function History({ language, userRole, onBack }: HistoryProps) {
  const [selectedCase, setSelectedCase] = useState<string | null>(null);

  const pastCases = [
    {
      id: 'CASE-001',
      date: '2024-12-10',
      dateFormatted: 'Dec 10, 2024',
      symptoms: 'Fever and cough',
      symptomsHi: 'बुखार और खांसी',
      riskLevel: 'low' as const,
      outcome: 'Visited PHC',
      outcomeHi: 'PHC का दौरा किया',
      imageUrl: null,
    },
    {
      id: 'CASE-002',
      date: '2024-12-05',
      dateFormatted: 'Dec 5, 2024',
      symptoms: 'Skin rash on arm',
      symptomsHi: 'बांह पर त्वचा पर चकत्ते',
      riskLevel: 'medium' as const,
      outcome: 'Medic consultation',
      outcomeHi: 'मेडिक परामर्श',
      imageUrl: '📷',
    },
    {
      id: 'CASE-003',
      date: '2024-11-28',
      dateFormatted: 'Nov 28, 2024',
      symptoms: 'Stomach pain',
      symptomsHi: 'पेट दर्द',
      riskLevel: 'low' as const,
      outcome: 'Home care advised',
      outcomeHi: 'घरेलू देखभाल की सलाह दी गई',
      imageUrl: null,
    },
  ];

  const getRiskColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low':
        return 'bg-green-100 text-green-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'high':
        return 'bg-red-100 text-red-700';
    }
  };

  const getRiskLabel = (level: 'low' | 'medium' | 'high') => {
    const labels = {
      low: { en: 'Low Risk', hi: 'कम जोखिम' },
      medium: { en: 'Medium Risk', hi: 'मध्यम जोखिम' },
      high: { en: 'High Risk', hi: 'उच्च जोखिम' },
    };
    return language === 'hindi' ? labels[level].hi : labels[level].en;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-green-500 px-6 pt-12 pb-6 text-white shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-white mb-1">Case History</h1>
            <p className="text-sm text-white/80">केस इतिहास</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <div className="text-2xl text-teal-600 mb-1">{pastCases.length}</div>
            <div className="text-xs text-gray-600">Total Cases</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <div className="text-2xl text-green-600 mb-1">
              {pastCases.filter((c) => c.riskLevel === 'low').length}
            </div>
            <div className="text-xs text-gray-600">Low Risk</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <div className="text-2xl text-yellow-600 mb-1">
              {pastCases.filter((c) => c.riskLevel === 'medium').length}
            </div>
            <div className="text-xs text-gray-600">Medium</div>
          </div>
        </div>

        {/* Past cases */}
        <div className="space-y-4">
          {pastCases.map((caseItem) => (
            <div key={caseItem.id} className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="text-sm text-gray-500 mb-1">ID: {caseItem.id}</div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{caseItem.dateFormatted}</span>
                      {caseItem.imageUrl && <span className="ml-2">📷</span>}
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs ${getRiskColor(caseItem.riskLevel)}`}>
                    {getRiskLabel(caseItem.riskLevel)}
                  </div>
                </div>

                {/* Symptoms */}
                <div className="mb-3 p-3 bg-gray-50 rounded-xl">
                  <div className="text-sm text-gray-600 mb-1">Symptoms:</div>
                  <div className="text-gray-800">{caseItem.symptoms}</div>
                  <div className="text-sm text-gray-500">{caseItem.symptomsHi}</div>
                </div>

                {/* Outcome */}
                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-1">Outcome:</div>
                  <div className="text-gray-800">{caseItem.outcome}</div>
                  <div className="text-sm text-gray-500">{caseItem.outcomeHi}</div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setSelectedCase(selectedCase === caseItem.id ? null : caseItem.id)
                    }
                    className="flex-1 bg-teal-500 text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-teal-600 transition-colors active:scale-[0.98] text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </button>
                  <button className="px-4 bg-gray-100 text-gray-700 py-3 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors active:scale-[0.98]">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Expanded details */}
              {selectedCase === caseItem.id && (
                <div className="border-t border-gray-100 bg-gray-50 p-5">
                  <h4 className="text-gray-800 mb-3">Full Report</h4>
                  
                  <div className="space-y-3 mb-4">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Submitted on</div>
                      <div className="text-sm text-gray-700">{caseItem.dateFormatted}</div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-gray-500 mb-1">AI Analysis</div>
                      <div className="text-sm text-gray-700">
                        Symptoms analyzed and matched with database. Risk level determined
                        based on severity indicators.
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Recommendations Given</div>
                      <div className="text-sm text-gray-700">{caseItem.outcome}</div>
                    </div>
                  </div>

                  <button className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors active:scale-[0.98]">
                    <Download className="w-4 h-4" />
                    <span className="text-sm">Download PDF Report</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty state message if no cases */}
        {pastCases.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-gray-800 mb-2">No Past Cases</h3>
            <p className="text-gray-600">
              {language === 'hindi'
                ? 'आपके पास अभी तक कोई केस इतिहास नहीं है'
                : "You don't have any case history yet"}
            </p>
          </div>
        )}

        {/* Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <div className="text-sm text-blue-800">
            <div className="font-medium mb-1">🔒 Your data is secure</div>
            <div className="text-blue-700">
              {language === 'hindi'
                ? 'सभी केस रिकॉर्ड एन्क्रिप्टेड और निजी हैं। केवल आप और अधिकृत स्वास्थ्य कार्यकर्ता ही इन्हें देख सकते हैं।'
                : 'All case records are encrypted and private. Only you and authorized health workers can view them.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
