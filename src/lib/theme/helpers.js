import { get, omit } from 'lodash';
import { mergeDeep } from './utils/mergeDeep';
import { styles } from '../styles';
import { themes } from './themes';
import allTokens from './tokens/tokens.json';

export const getElementStyle = (theme, name, variant = 'default', status) => {
  if (!status) {
    return get(theme, [name, variant], {});
  }

  return get(theme, [name, variant, 'status', status], {});
};

/**
 * Element helpers
 */

export const getElement = (theme, name, variant, status) => {
  return {
    ...getElementStyle(theme, name),
    ...getElementStyle(theme, name, variant),
    ...getElementStyle(theme, name, variant, status),
    status: undefined
  };
};

export const element = name => callback => props =>
  callback(getElement(props.theme, name, props.variant, props.status), props);

/**
 * Border helpers
 */

export const getBorder = (theme, name, variant, status) => {
  const { borderColor, borderRadius, borderStyle, borderWidth } = getElement(theme, name, variant, status);

  const borderStyles = {
    borderColor,
    borderRadius,
    borderStyle,
    borderWidth
  };

  if (styles.colors[borderColor]) {
    borderStyles.borderColor = styles.colors[borderColor];
    borderStyles.borderColorCode = borderColor;
  }

  return borderStyles;
};

export const getBorderMixins = (...args) => {
  const mixins = getBorder(...args) || {};

  if (mixins.borderColorCode) {
    mixins.borderColor = mixins.borderColorCode;
    delete mixins.borderColorCode;
  }

  return mixins;
};

export const border = name => props =>
  omit(getBorder(props.theme, name, props.variant, props.status), ['borderColorCode']);

/**
 * Color helpers
 */

export const getColor = (theme, name, variant, status) => {
  const { backgroundColor, color } = getElement(theme, name, variant, status);
  const colors = theme?.themeScheme?.colors ?? {};

  const colorStyles = { backgroundColor, color };

  if (colors[backgroundColor]) {
    colorStyles.backgroundColor = colors[backgroundColor];
    colorStyles.backgroundColorCode = backgroundColor;
  }

  if (colors[color]) {
    colorStyles.color = colors[color];
    colorStyles.colorCode = color;
  }

  return colorStyles;
};

export const getColorMixins = (...args) => {
  const mixins = getColor(...args);

  if (mixins.colorCode) {
    mixins.color = mixins.colorCode;
    delete mixins.colorCode;
  }

  if (mixins.backgroundColorCode) {
    mixins.backgroundColor = mixins.backgroundColorCode;
    delete mixins.backgroundColorCode;
  }

  return mixins;
};

export const color = name => props =>
  omit(getColor(props.theme, name, props.variant, props.status), ['backgroundColorCode', 'colorCode']);

/**
 * Position helpers
 */

export const getPosition = (theme, name, variant, status) => {
  const { bottom, left, position, right, top } = getElement(theme, name, variant, status);

  return {
    bottom,
    left,
    position,
    right,
    top
  };
};

export const getPositionMixins = (...args) => {
  const {
    bottom: layoutBottom,
    left: layoutLeft,
    position: layoutPosition,
    right: layoutRight,
    top: layoutTop
  } = getPosition(...args);

  return {
    layoutBottom,
    layoutLeft,
    layoutPosition,
    layoutRight,
    layoutTop
  };
};

export const position = name => props => getPosition(props.theme, name, props.variant, props.status);

const mapFontFamily = fontFamily => {
  return fontFamily === 'Metropolis' ? 'Metropolis' : fontFamily;
};

const mapFontWeight = fontWeight => {
  if (fontWeight === 'normal') {
    return 400;
  }

  if (fontWeight === 'semibold') {
    return 500;
  }

  if (fontWeight === 'bold') {
    return 700;
  }
};

/**
 * Typography helpers.
 */

export const getTypography = (theme, name, variant, status) => {
  const {
    fontFamily: baseFontFamily,
    fontSize,
    fontWeight: baseFontWeight,
    letterSpacing,
    lineHeight,
    textAlign,
    textDecoration
  } = getElement(theme, name, variant, status);

  const fontFamily = mapFontFamily(baseFontFamily);
  const fontWeight = mapFontWeight(baseFontWeight);

  return {
    fontFamily,
    fontSize,
    fontWeight,
    letterSpacing,
    lineHeight,
    textAlign,
    textDecoration
  };
};

export const getTypographyMixins = (...args) => {
  return getTypography(...args);
};

export const typography = name => props => getTypography(props.theme, name, props.variant, props.status);

export const getThemeSettings = name => ({
  colors: themes[name],
  name,
  // Keep backwards compatibility
  themeScheme: {
    colors: themes[name],
    name
  },
  tokens: mergeDeep(allTokens.global, allTokens[name])
});
