import * as locales from '../../assets/locales';
import { I18n } from './provider';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import dayjs from './dayjs';

const languageDetector = new LanguageDetector(null, {
  order: ['navigator', 'querystring', 'cookie', 'sessionStorage', 'localStorage'],
});

languageDetector.addDetector({
  cacheUserLanguage: (language) => dayjs.locale(language),
  name: 'dayjs',
});
languageDetector.options.caches.push('dayjs');

I18n.init([languageDetector, initReactI18next], locales);
