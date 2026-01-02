// Translation service using MyMemory Translation API (free, no auth required)
// API: https://mymemory.translated.net/doc/spec.php

export type Language = 'en' | 'hi' | 'ta' | 'te' | 'bn' | 'mr';

interface TranslationCache {
  [key: string]: string;
}

class TranslationService {
  private cache: TranslationCache = {};
  private readonly API_URL = 'https://api.mymemory.translated.net/get';
  private pendingRequests: Map<string, Promise<string>> = new Map();

  // Get language code for API
  private getLanguageCode(lang: Language): string {
    const codes: Record<Language, string> = {
      'en': 'en-US',
      'hi': 'hi-IN',
      'ta': 'ta-IN',
      'te': 'te-IN',
      'bn': 'bn-IN',
      'mr': 'mr-IN',
    };
    return codes[lang];
  }

  // Create cache key
  private getCacheKey(text: string, targetLang: Language): string {
    return `${text}|${targetLang}`;
  }

  // Translate single text
  async translate(text: string, targetLang: Language): Promise<string> {
    // If target is English, return as-is
    if (targetLang === 'en') {
      return text;
    }

    // Check cache first
    const cacheKey = this.getCacheKey(text, targetLang);
    if (this.cache[cacheKey]) {
      return this.cache[cacheKey];
    }

    // Check if there's a pending request for this translation
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey)!;
    }

    // Create new translation request
    const translationPromise = this.fetchTranslation(text, targetLang);
    this.pendingRequests.set(cacheKey, translationPromise);

    try {
      const result = await translationPromise;
      this.cache[cacheKey] = result;
      return result;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  // Fetch translation from API
  private async fetchTranslation(text: string, targetLang: Language): Promise<string> {
    try {
      const sourceLang = 'en-US';
      const targetCode = this.getLanguageCode(targetLang);
      
      const url = `${this.API_URL}?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetCode}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.responseStatus === 200 && data.responseData?.translatedText) {
        return data.responseData.translatedText;
      }
      
      // Fallback to original text if translation fails
      return text;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Return original text on error
    }
  }

  // Translate multiple texts in batch
  async translateBatch(texts: string[], targetLang: Language): Promise<Record<string, string>> {
    const translations: Record<string, string> = {};
    
    // Translate in parallel but with a reasonable limit to avoid rate limiting
    const batchSize = 5;
    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);
      const results = await Promise.all(
        batch.map(text => this.translate(text, targetLang))
      );
      
      batch.forEach((text, index) => {
        translations[text] = results[index];
      });
    }
    
    return translations;
  }

  // Pre-cache common phrases
  async preCacheCommonPhrases(targetLang: Language) {
    const commonPhrases = [
      'Home',
      'Dashboard',
      'Patients',
      'Reports',
      'History',
      'Symptoms',
      'Upload',
      'Call',
      'Emergency',
      'Doctor',
      'Medicine',
      'Hospital',
      'Continue',
      'Submit',
      'Cancel',
      'Back',
      'Next',
      'Save',
      'Delete',
      'Edit',
      'View',
      'Search',
      'Filter',
      'Loading',
      'Success',
      'Error',
      'Warning',
      'Critical',
      'Urgent',
      'Normal',
      'Online',
      'Offline',
    ];

    await this.translateBatch(commonPhrases, targetLang);
  }

  // Clear cache
  clearCache() {
    this.cache = {};
  }

  // Get cache size
  getCacheSize(): number {
    return Object.keys(this.cache).length;
  }
}

export const translationService = new TranslationService();
