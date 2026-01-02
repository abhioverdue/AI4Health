import { useTranslate } from '../hooks/useTranslation';

interface TranslatedTextProps {
  children: string;
  className?: string;
  as?: 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export function TranslatedText({ children, className = '', as: Component = 'span' }: TranslatedTextProps) {
  const translated = useTranslate(children);
  
  return <Component className={className}>{translated}</Component>;
}
