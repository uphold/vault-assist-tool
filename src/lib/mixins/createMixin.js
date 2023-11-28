import helpers from './helpers';

export const createMixin = definitions => {
  const mixin = props => {
    return Object.keys(props).reduce((styles, key) => {
      if (!definitions[key]) {
        return styles;
      }

      const { properties, transform = value => value } = definitions[key];

      const result = transform(props[key], props.theme || {}, definitions[key]);

      if (typeof result === 'undefined' || result === null) {
        return styles;
      }

      properties.forEach(property => (styles[property] = `${result}`));

      return styles;
    }, {});
  };

  mixin.definitions = definitions;
  mixin.isPropFromMixin = propName => helpers.isPropFromMixin(mixin, propName);
  mixin.propNames = Object.keys(definitions);

  return mixin;
};
