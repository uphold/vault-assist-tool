import { AnimationConfig, ButtonSize, ButtonType } from './lib';
import { ButtonIcon } from './ButtonIcon';
import { ButtonText } from '../Typography/ButtonText';
import { Fragment } from 'react';
import { Mixed } from '../Mixed';
import Animated, { useAnimatedStyle, useDerivedValue, withTiming } from 'react-native-reanimated';
import PropTypes from 'prop-types';

const AnimatedButtonText = Animated.createAnimatedComponent(ButtonText);
const AnimatedButtonIcon = Animated.createAnimatedComponent(ButtonIcon);

export const ButtonContent = ({
  centerIcon,
  children,
  color,
  hoverColor,
  iconAdjustedMarginVertical,
  isHovered,
  leadingIcon,
  size,
  testID,
  trailingIcon,
  type
}) => {
  const animatedColor = useDerivedValue(
    () => withTiming(isHovered.value && hoverColor ? hoverColor : color, AnimationConfig),
    [color, hoverColor]
  );

  const animatedStyle = useAnimatedStyle(
    () => ({
      color: animatedColor.value
    }),
    []
  );

  // eslint-disable-next-line react/prop-types
  const IconWrapper = ({ icon, iconType, ...props }) => {
    if (typeof icon !== 'string') {
      return icon;
    }

    return (
      <Mixed.View marginVertical={iconAdjustedMarginVertical} {...props}>
        <AnimatedButtonIcon
          fill="currentColor"
          icon={icon}
          size={size}
          style={{ color: animatedColor }}
          testID={`${testID}-${iconType}`}
          type={type}
        />
      </Mixed.View>
    );
  };

  const Text = AnimatedButtonText;

  return (
    <Fragment>
      {leadingIcon && <IconWrapper icon={leadingIcon} iconType="leadingIcon" />}

      {centerIcon ? (
        <IconWrapper icon={centerIcon} iconType="centerIcon" />
      ) : (
        <Text
          display="flex"
          paddingLeft={!leadingIcon && trailingIcon ? '$dimension-2' : 0}
          paddingRight={leadingIcon && !trailingIcon ? '$dimension-2' : 0}
          style={animatedStyle}
        >
          {children}
        </Text>
      )}

      {trailingIcon && <IconWrapper icon={trailingIcon} iconType="trailingIcon" />}
    </Fragment>
  );
};

ButtonContent.defaultProps = {
  centerIcon: undefined,
  children: undefined,
  color: undefined,
  hoverColor: undefined,
  iconAdjustedMarginVertical: 0,
  isHovered: undefined,
  leadingIcon: undefined,
  size: undefined,
  testID: undefined,
  trailingIcon: undefined,
  type: undefined
};

ButtonContent.propTypes = {
  centerIcon: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  children: PropTypes.node,
  color: PropTypes.string,
  hoverColor: PropTypes.string,
  iconAdjustedMarginVertical: PropTypes.number,
  isHovered: PropTypes.shape(Animated.SharedValue),
  leadingIcon: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  size: PropTypes.oneOf(Object.values(ButtonSize)),
  testID: PropTypes.string,
  trailingIcon: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  type: PropTypes.oneOf(Object.values(ButtonType))
};
