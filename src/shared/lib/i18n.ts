import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import tr from '@/locales/tr.json';
import en from '@/locales/en.json';

// Get initial language from localStorage or default to 'tr'
const getInitialLanguage = () => {
  try {
    const stored = localStorage.getItem('settings-storage');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed?.state?.settings?.language) {
        return parsed.state.settings.language;
      }
    }
  } catch (e) {
    // Ignore parse errors
  }
  return 'tr';
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      tr: {
        translation: tr,
      },
      en: {
        translation: en,
      },
    },
    lng: getInitialLanguage(),
    fallbackLng: 'tr',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;

