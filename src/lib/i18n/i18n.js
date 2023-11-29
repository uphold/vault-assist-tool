import * as locales from '../../assets/locales';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import React, { Fragment } from 'react';
import i18next from 'i18next';

export const languageCodes = Object.freeze({
  EN: 'en',
  ES: 'es'
});

const interpolationMatch = /({{[^}]*}})/gm;

const hasComponent = options => {
  try {
    return Object.values(options).some(React.isValidElement);
  } catch (error) {
    return false;
  }
};

const renderNestedComponents = (key, options) => {
  const rawValue = i18next.t(key, { skipInterpolation: true });

  return (
    <Fragment>
      {rawValue.split(interpolationMatch).map((value, index) => {
        if (!interpolationMatch.test(value)) {
          return value;
        }

        const interpolationKey = value.replace(/{|}/g, '');
        const optionValue = options?.[interpolationKey];

        if (optionValue) {
          return <Fragment key={index}>{optionValue}</Fragment>;
        }
      })}
    </Fragment>
  );
};

export const setLocales = (locales = {}) => {
  Object.entries(locales).forEach(([lang, locale = {}]) =>
    Object.entries(locale).forEach(([ns, values]) => i18next.addResourceBundle(lang, ns, values, true, true))
  );
};

export const translate = (key, options) => {
  if (hasComponent(options)) {
    return renderNestedComponents(key, options);
  }

  return i18next.t(key, options);
};

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag', 'path', 'subdomain']
    },
    fallbackLng: languageCodes.EN,
    interpolation: {
      escapeValue: false,
      skipOnVariables: false
    },
    keySeparator: ' ',
    resources: Object.fromEntries(Object.entries(locales).map(([lang, locale = {}]) => [lang, locale])),
    supportedLngs: Object.values(languageCodes)
  });
