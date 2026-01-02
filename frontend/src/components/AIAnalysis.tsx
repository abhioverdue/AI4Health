import { useEffect, useState } from 'react';
import { Language } from '../App';
import { Icon3DAIAnalysis } from './3d-icons/Icon3DAIAnalysis';
import { motion } from 'framer-motion';

interface AIAnalysisProps {
  language: Language;
  onComplete: (result: {
    riskLevel: 'low' | 'medium' | 'high';
    conditions: string[];
  }) => void;
}

export function AIAnalysis({ language, onComplete }: AIAnalysisProps) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(0);

  const stages = [
    {
      en: 'Analyzing symptoms...',
      hi: 'लक्षणों का विश्लेषण...',
    },
    {
      en: 'Checking image...',
      hi: 'छवि जाँच रहे हैं...',
    },
    {
      en: 'Comparing with database...',
      hi: 'डेटाबेस से तुलना...',
    },
    {
      en: 'Generating recommendations...',
      hi: 'सिफारिशें बना रहे हैं...',
    },
  ];

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    const stageInterval = setInterval(() => {
      setStage((prev) => (prev < stages.length - 1 ? prev + 1 : prev));
    }, 1500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stageInterval);
    };
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      setTimeout(() => {
        // Simulate different risk levels
        const outcomes: Array<{
          riskLevel: 'low' | 'medium' | 'high';
          conditions: string[];
        }> = [
          {
            riskLevel: 'low',
            conditions: ['Common Cold', 'Mild Fever'],
          },
          {
            riskLevel: 'medium',
            conditions: ['Bacterial Infection', 'Skin Rash'],
          },
          {
            riskLevel: 'high',
            conditions: ['Severe Infection', 'Immediate Attention Needed'],
          },
        ];
        const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
        onComplete(randomOutcome);
      }, 1000);
    }
  }, [progress, onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 flex flex-col items-center justify-center p-6">
      <div className="text-center max-w-sm">
        {/* 3D AI illustration */}
        <div className="mb-8">
          <Icon3DAIAnalysis size={200} />
        </div>

        {/* Progress ring */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
            />
            <motion.circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 56}
              initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
              animate={{
                strokeDashoffset: 2 * Math.PI * 56 * (1 - progress / 100),
              }}
              transition={{ duration: 0.3 }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#14b8a6" />
                <stop offset="100%" stopColor="#22c55e" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-teal-600">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Current stage */}
        <motion.div
          key={stage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <h2 className="text-gray-800 mb-1">
            {language === 'hindi' ? stages[stage].hi : stages[stage].en}
          </h2>
        </motion.div>

        {/* Description */}
        <p className="text-gray-600 mb-8">
          {language === 'hindi'
            ? 'कृपया प्रतीक्षा करें। यह कुछ सेकंड ले सकता है।'
            : 'Please wait. This may take a few seconds.'}
        </p>

        {/* Pulsing dots */}
        <div className="flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-teal-500 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
