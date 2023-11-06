import { set } from 'lodash';
import { themes } from './themes';

function ThemeBuilder(theme = {}) {
  this.theme = theme;
}

ThemeBuilder.prototype.getTheme = function () {
  return this.theme;
};

ThemeBuilder.prototype.setTheme = function (name = 'light') {
  set(this.theme, 'themeScheme', { colors: themes[name], name });

  return this;
};

ThemeBuilder.prototype.setElement = function (name, query, properties) {
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
};

export default ThemeBuilder;
