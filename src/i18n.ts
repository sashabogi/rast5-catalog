import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Define supported locales
export const locales = ['en', 'es', 'it', 'ru', 'de', 'pt'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

// Locale display names and flags
export const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  it: 'Italiano',
  ru: 'Русский',
  de: 'Deutsch',
  pt: 'Português',
};

export const localeFlags: Record<Locale, string> = {
  en: '🇬🇧',
  es: '🇪🇸',
  it: '🇮🇹',
  ru: '🇷🇺',
  de: '🇩🇪',
  pt: '🇵🇹',
};

export default getRequestConfig(async ({ locale }) => {
  // Ensure that a valid locale is used
  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
    // Return the key name instead of throwing an error for missing translations
    onError(error) {
      // Silently ignore missing translation errors
      if (error.code === 'MISSING_MESSAGE') {
        console.warn(`Missing translation: ${error.originalMessage}`);
      }
    },
    getMessageFallback({ namespace, key }) {
      return `${namespace}.${key}`;
    }
  };
});
