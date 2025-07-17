import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './en.json';
import id from './id.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    id: { translation: id }
  },
  lng: localStorage.getItem('bahasa') || 'id', // default ke Indonesia
  fallbackLng: 'id',
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
