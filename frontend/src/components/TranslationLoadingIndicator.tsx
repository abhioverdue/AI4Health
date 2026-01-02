import { useTranslation } from '../hooks/useTranslation';
import { Languages } from 'lucide-react';

export function TranslationLoadingIndicator() {
  const { isTranslating } = useTranslation();

  if (!isTranslating) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-teal-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-pulse">
        <Languages className="w-4 h-4 animate-spin" />
        <span className="text-sm">Translating...</span>
      </div>
    </div>
  );
}
