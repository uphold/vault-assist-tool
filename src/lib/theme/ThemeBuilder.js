import { set } from 'lodash';
import { themes } from './themes';

class ThemeBuilder {
  constructor(theme = {}) {
    this.theme = theme;
  }
  getTheme() {
    return this.theme;
  }
  setElement(name, query, properties) {
    if (!name || !query) {
      return this;
    }

    if (!properties) {
      properties = query;
      query = {};
    }

    const { status, variant = 'default' } = query;

    if (!status) {
      set(this.theme, [name, variant], properties);

      return this;
    }

    set(this.theme, [name, variant, 'status', status], properties);

    return this;
  }
  setTheme(name = 'light') {
    set(this.theme, 'themeScheme', { colors: themes[name], name });

    return this;
  }
}

export default ThemeBuilder;
