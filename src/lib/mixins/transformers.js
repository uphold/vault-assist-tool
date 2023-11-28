import { getTokenValue, isToken } from '../theme/tokens';
import { styles } from '../styles';
import Utils from '../styles/Utils';
import radii from '../styles/radii';
import spacings from '../styles/spacings';

const colorRegex = /((?:blue-|green-|red-|yellow-|neutral-|[abeginpsw]{1})\d{2,3}$)|(?:pure-white$|pure-black$)/;

const getColor = (color, { colors = styles.colors, tokens } = {}) => {
  if (isToken(color)) {
    return getTokenValue({ tokens, value: color });
  }

  if (typeof colors[color] !== 'undefined') {
    return colors[color];
  }

  return color;
};

const getColorWithOpacity = (rawColor, opacity = 1, theme) => {
  const color = getColor(rawColor, theme);

  if (opacity === 1) {
    return color;
  }

  if (color.indexOf('#') !== 0) {
    throw new Error('Change the color opacity is only supported on hex and color code values');
  }

  return Utils.getColorWithOpacity(color, opacity);
};

const getRadius = (radius, defaultUnit, { tokens }) => {
  if (isToken(radius)) {
    return getTokenValue({ tokens, value: radius });
  }

  if (typeof radii[radius] === 'undefined') {
    return radius;
  }

  return `${radii[radius]}${defaultUnit}`;
};

const getSpacing = (spacing, defaultUnit, { tokens }) => {
  if (isToken(spacing)) {
    return getTokenValue({ tokens, value: spacing });
  }

  if (typeof spacings[spacing] === 'undefined') {
    return spacing;
  }

  return `${spacings[spacing]}${defaultUnit}`;
};

export const transformBorder = () => (raw, theme) => {
  if (typeof raw !== 'string') {
    return raw;
  }

  const match = raw.match(colorRegex);

  if (!match || !match.length) {
    return raw;
  }

  const [color] = match;

  return raw.replace(colorRegex, getColor(color, theme));
};

export const transformColor = () => (raw, theme) => {
  if (Array.isArray(raw) && raw.length === 2) {
    return getColorWithOpacity(raw[0], raw[1], theme);
  }

  if (!!raw && typeof raw === 'object') {
    return getColorWithOpacity(raw.color, raw.opacity, raw.force ? undefined : theme);
  }

  return getColor(raw, theme);
};

export const transformNumber =
  ({ defaultUnit = 'px' } = {}) =>
  (raw, theme) => {
    if (typeof raw === 'number') {
      return `${raw}${defaultUnit}`;
    }

    if (isToken(raw)) {
      return getTokenValue({ tokens: theme.tokens, value: raw });
    }

    return raw;
  };

export const transformRadius =
  ({ defaultUnit = 'px' } = {}) =>
  (raw, theme) => {
    if (typeof raw === 'number') {
      return `${raw}${defaultUnit}`;
    }

    if (typeof raw === 'string' && raw.indexOf(' ') >= 0) {
      return raw
        .split(' ')
        .map(rawBit => getRadius(rawBit, defaultUnit, theme))
        .join(' ');
    }

    return getRadius(raw, defaultUnit, theme);
  };

export const transformSpace =
  ({ defaultUnit = 'px' } = {}) =>
  (raw, theme) => {
    if (typeof raw === 'number') {
      return `${raw}${defaultUnit}`;
    }

    if (typeof raw === 'string' && raw.indexOf(' ') >= 0) {
      return raw
        .split(' ')
        .map(rawBit => getSpacing(rawBit, defaultUnit, theme))
        .join(' ');
    }

    return getSpacing(raw, defaultUnit, theme);
  };

export const transformString = () => raw => /['\n]/.test(raw) ? raw : `'${raw}'`;

const transformers = {
  transformBorder,
  transformColor,
  transformNumber,
  transformRadius,
  transformSpace,
  transformString
};

export default transformers;
