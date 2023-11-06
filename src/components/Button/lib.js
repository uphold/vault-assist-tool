import { Easing } from 'react-native-reanimated';
import { get } from '../../lib/theme/utils/get';
import PropTypes from 'prop-types';

export const AnimationConfig = {
  duration: 200,
  easing: Easing.inOut(Easing.ease),
};

export const ButtonSize = Object.freeze({
  ExtraSmall: 'xsmall',
  Regular: 'regular',
  Small: 'small',
});

export const ButtonType = Object.freeze({
  Critical: 'critical',
  Ghost: 'ghost',
  Neutral: 'neutral',
  Primary: 'primary',
  Secondary: 'secondary',
});

export const getIconSize = ({ size, tokens }) => {
  const iconSize = {
    [ButtonSize.ExtraSmall]: tokens.dimension[5],
    [ButtonSize.Regular]: tokens.dimension[7],
    [ButtonSize.Small]: tokens.dimension[6],
  }[size];

  return {
    height: iconSize,
    width: iconSize,
  };
};

export const getCircleStyles = ({ type, tokens, size, borderWidth }) =>
  ({
    [ButtonSize.ExtraSmall]: {
      layoutWidth: getIconSize({ size, tokens, type }).width + 6 * 2,
      padding: 6 - borderWidth,
    },
    [ButtonSize.Small]: {
      layoutWidth: getIconSize({ size, tokens, type }).width + 10 * 2,
      padding: 10 - borderWidth,
    },
  }[size]);

export const Padding = Object.freeze({
  [ButtonSize.ExtraSmall]: '3px 20px',
  [ButtonSize.Regular]: '13px $dimension-7',
  [ButtonSize.Small]: '5px $dimension-5',
});

export const getBackground = ({ tokens, type }) => get(tokens.action, type.split('-'));

export const getBorderColor = ({ tokens, type }) => {
  if (type === ButtonType.AppleWallet) {
    return tokens.border.apple.wallet;
  }

  if (type === ButtonType.Secondary) {
    return {
      default: tokens.border.primary,
      disabled: tokens.border.disabled,
      hover: tokens.border.primary,
      pressed: tokens.border.primary,
    };
  }
};

export const getColor = ({ isDisabled, tokens, type }) =>
  ({
    [ButtonType.Critical]: isDisabled ? tokens.content.disabled : tokens.content.on.critical,
    [ButtonType.Ghost]: isDisabled ? tokens.content.disabled : tokens.content.on.ghost,
    [ButtonType.Neutral]: isDisabled ? tokens.content.disabled : tokens.content.on.neutral,
    [ButtonType.Primary]: isDisabled ? tokens.content.disabled : tokens.content.on.primary,
    [ButtonType.Secondary]: isDisabled ? tokens.content.disabled : tokens.content.on.secondary,
  }[type]);

export const getHoverColor = ({ tokens, type }) =>
  ({
    [ButtonType.Ghost]: tokens.content.on.secondary,
  }[type]);

export const getPadding = ({ borderWidth, size }) =>
  ({
    [ButtonSize.ExtraSmall]: `${4 - borderWidth}px 20px`,
    [ButtonSize.Regular]: `${14 - borderWidth}px $dimension-7`,
    [ButtonSize.Small]: `${6 - borderWidth}px $dimension-5`,
  }[size]);

export const defaultProps = {
  buttonType: ButtonType.Primary,
  centerIcon: null,
  children: null,
  leadingIcon: null,
  onClick: undefined,
  onPress: undefined,
  size: ButtonSize.Regular,
  testID: undefined,
  trailingIcon: null,
};

export const propTypes = {
  buttonType: PropTypes.oneOf(Object.values(ButtonType)),
  centerIcon: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  children: PropTypes.node,
  leadingIcon: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  onClick: PropTypes.func,
  onPress: PropTypes.func,
  size: PropTypes.oneOf(Object.values(ButtonSize)),
  testID: PropTypes.string,
  trailingIcon: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
};
