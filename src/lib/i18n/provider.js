import React, { Fragment } from 'react';
import i18next from 'i18next';

export const languageCodes = Object.freeze({
  EN: 'en'
});

const defaultOptions = {
  compatibilityJSON: 'v3',
  fallbackLng: languageCodes.EN,
  interpolation: {
    escapeValue: false,
    skipOnVariables: false
  },
  keySeparator: ' ',
  resource: {},
  supportedLngs: Object.values(languageCodes)
};

const interpolationMatch = /({{[^}]*}})/gm;

class I18nComponent {
  constructor() {
    this.init();
  }

  get activeLanguagePrefix() {
    return this.parseLanguagePrefix(this.instance?.language);
  }

  exists(key, options) {
    return this.instance.exists(key, options);
  }

  hasComponent(options) {
    try {
      return Object.values(options).some(React.isValidElement);
    } catch (error) {
      return false;
    }
  }

  init(plugins, locales, options = {}) {
    this.setProvider(i18next.createInstance());
    this.setPlugins(plugins);

    this.instance.init({ ...defaultOptions, ...options });
    this.setLocales(locales);
    this.instance.changeLanguage(this.activeLanguagePrefix);
  }

  get instance() {
    if (!this.provider) {
      throw new Error('I18n provider needs to be defined first.');
    }

    return this.provider;
  }

  parseLanguagePrefix(language) {
    return (language || languageCodes.EN).substring(0, 2);
  }

  renderNestedComponents(key, options) {
    const rawValue = this.instance.t(key, { skipInterpolation: true });

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
  }

  setLocales(locales = {}) {
    Object.entries(locales).forEach(([lang, locale = {}]) =>
      Object.entries(locale).forEach(([ns, values]) => this.instance.addResourceBundle(lang, ns, values, true, true))
    );
  }

  setPlugins(plugins) {
    plugins?.forEach(plugin => {
      if (plugin) {
        this.instance.use(plugin);
      }
    });
  }

  setProvider(provider) {
    this.provider = provider;
  }

  t(key, options) {
    if (this.hasComponent(options)) {
      return this.renderNestedComponents(key, options);
    }

    return this.instance.t(key, options);
  }
}

export const I18n = new I18nComponent();
