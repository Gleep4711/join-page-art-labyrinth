import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ru from './locales/ru.json';
import en from './locales/en.json';
import md from './locales/md.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: ['ru', 'en', 'md'],
    resources: {
      ru: { translation: ru },
      en: { translation: en },
      md: { translation: md },
    },
    fallbackLng: 'ru',
    interpolation: { escapeValue: false },
  });

  export default i18n;