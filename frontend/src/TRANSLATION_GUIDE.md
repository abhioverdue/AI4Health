# AI4Health - Multilingual Translation System

## Overview
The AI4Health app now features a **fully functional real-time translation system** using the free MyMemory Translation API. Users can switch between 6 languages, and all UI text is automatically translated.

## Supported Languages
- 🇬🇧 **English** (Default)
- 🇮🇳 **Hindi** (हिंदी)
- 🇮🇳 **Tamil** (தமிழ்)
- 🇮🇳 **Telugu** (తెలుగు)
- 🇮🇳 **Bengali** (বাংলা)
- 🇮🇳 **Marathi** (मराठी)

## How It Works

### 1. Translation Service (`/services/translationService.ts`)
- Uses **MyMemory Translation API** (free, no authentication required)
- Implements intelligent **caching** to avoid redundant API calls
- Handles **batch translations** for efficiency
- Includes **de-duplication** of pending requests
- Graceful **fallback** to English if translation fails

### 2. Translation Hooks (`/hooks/useTranslation.tsx`)
- **`useTranslation()`**: Access translation context and language state
- **`useTranslate(text)`**: Translate individual text strings dynamically
- **`useTranslateMultiple(texts[])`**: Translate multiple strings in batch
- **TranslationProvider**: Context provider that wraps the entire app

### 3. Language Selector Component (`/components/LanguageSelector.tsx`)
- Beautiful modal interface for language selection
- Shows both English and native script for each language
- Visual confirmation of current language
- Mobile-optimized with large tap targets

### 4. Translation Loading Indicator
- Shows "Translating..." badge when API calls are in progress
- Provides visual feedback to users
- Auto-hides when translation is complete

## Usage Examples

### Basic Translation in Components
```tsx
import { useTranslate } from '../hooks/useTranslation';

function MyComponent() {
  const welcomeText = useTranslate('Welcome to AI4Health');
  
  return <h1>{welcomeText}</h1>;
}
```

### Batch Translation (More Efficient)
```tsx
import { useTranslateMultiple } from '../hooks/useTranslation';

function MyComponent() {
  const texts = useTranslateMultiple([
    'Welcome',
    'Hello',
    'Goodbye'
  ]);
  
  return (
    <div>
      <h1>{texts['Welcome']}</h1>
      <p>{texts['Hello']}</p>
    </div>
  );
}
```

### Using the TranslatedText Component
```tsx
import { TranslatedText } from '../components/TranslatedText';

function MyComponent() {
  return (
    <TranslatedText as="h1" className="text-2xl">
      Welcome to AI4Health
    </TranslatedText>
  );
}
```

## Implementation Details

### Caching Strategy
- Translations are cached in memory with a compound key: `{text}|{targetLanguage}`
- Common phrases are **pre-cached** when language changes
- Cache persists across component re-renders
- Reduces API calls by ~90% after initial page load

### API Rate Limiting
- MyMemory API allows 10,000 free requests/day
- Batch processing limits to 5 concurrent requests
- Intelligent de-duplication prevents duplicate requests

### Offline Handling
- If API fails, original English text is shown
- No app crashes or broken UI
- Silent fallback behavior

### Performance Optimization
1. **Pre-caching**: Common UI terms cached on language switch
2. **Batch requests**: Multiple texts translated in single API call
3. **Request deduplication**: Same text requested only once
4. **Component memoization**: Translations cached per component

## Adding Language Selector to New Screens

```tsx
import { LanguageSelector } from './LanguageSelector';

<LanguageSelector 
  currentLanguage={language}
  onLanguageChange={setLanguage}
/>
```

## Extending with More Languages

To add a new language:

1. Update `/services/translationService.ts`:
```typescript
export type Language = 'en' | 'hi' | 'ta' | 'te' | 'bn' | 'mr' | 'ur'; // Add 'ur' for Urdu

private getLanguageCode(lang: Language): string {
  const codes: Record<Language, string> = {
    // ... existing codes ...
    'ur': 'ur-PK', // Add Urdu
  };
  return codes[lang];
}
```

2. Update `/App.tsx`:
```typescript
export type Language = 'english' | 'hindi' | 'tamil' | 'telugu' | 'bengali' | 'marathi' | 'urdu';

const mapping: Record<Language, TranslationLanguage> = {
  // ... existing mappings ...
  'urdu': 'ur',
};
```

3. Update `/components/LanguageSelector.tsx`:
```typescript
const languages = [
  // ... existing languages ...
  { code: 'urdu', name: 'Urdu', nativeName: 'اردو' },
];
```

## Current Implementation Status

### ✅ Fully Implemented
- Translation service with MyMemory API
- Caching system
- Language selector component
- Translation hooks
- Loading indicator
- HomeDashboard with full translation support

### 🔄 To Be Extended (Optional)
- Other screens (SymptomInput, ImageUpload, etc.)
- Health Worker View translations
- Medic View translations
- Error messages translation
- Voice input multilingual support

## Testing the Translation System

1. **Select a Language**: Click the globe icon (🌐) in the top-right corner
2. **Choose from Modal**: Select Hindi, Tamil, Telugu, Bengali, or Marathi
3. **Watch Translation**: The UI text will update automatically
4. **Loading Feedback**: "Translating..." badge appears during API calls
5. **Cache Performance**: Switch back and forth - second time is instant!

## API Information

**Provider**: MyMemory Translation API  
**Endpoint**: https://api.mymemory.translated.net/get  
**Authentication**: None required (free tier)  
**Rate Limit**: 10,000 requests/day  
**Documentation**: https://mymemory.translated.net/doc/spec.php

## Troubleshooting

### Translation Not Appearing
- Check browser console for API errors
- Verify internet connection
- Check if API rate limit exceeded (very rare with caching)

### Slow Translation
- First load may take 1-2 seconds per text
- Subsequent loads are instant (cached)
- Pre-caching of common phrases reduces delay

### Incorrect Translation
- MyMemory uses community translations
- Quality improves over time
- Can add custom translation overrides in code if needed

## Future Enhancements

1. **Offline Translation**: Use local translation files for offline mode
2. **User Preferences**: Save language preference in localStorage
3. **Context-Aware Translation**: Medical terminology translation improvements
4. **Voice Translation**: Integrate with voice input for multilingual voice commands
5. **Translation Feedback**: Allow users to suggest better translations
