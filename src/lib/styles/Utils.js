import fonts from './fonts';

export default class {
  static getColorWithOpacity(color, opacity) {
    const percentage = Math.trunc(opacity * 255).toString(16);

    if (percentage.length === 1) {
      return `${color}0${percentage}`;
    }

    return `${color}${percentage}`;
  }

  static getFontFamily(weight = 'regular', type = 'regular', isCardFont = false) {
    if (isCardFont) {
      return fonts.card.regular;
    }

    return fonts[type][weight];
  }
}
