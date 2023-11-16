// import { AnimatedMixed } from '../Mixed';
import { Animation } from '../Animation/Animation';
import {
  AnimationConfig,
  ButtonSize,
  ButtonType,
  defaultProps,
  getBackground,
  getBorderColor,
  getCircleStyles,
  getColor,
  getHoverColor,
  getIconSize,
  getPadding,
  propTypes,
} from './lib';
import { ButtonContent } from './ButtonContent';
import { Mixed } from '../Mixed';
import { useEffect, useMemo, useRef } from 'react';
import { useTheme } from '../../hooks/useTheme';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const AnimatedMixed = Animated.createAnimatedComponent(Mixed.button);

export const Button = ({
  'data-test': dataTest,
  buttonType,
  centerIcon,
  children,
  isDisabled,
  isLoading,
  leadingIcon,
  onClick,
  onPress,
  size,
  testID: providedTestID,
  trailingIcon,
  ...props
}) => {
  const { tokens } = useTheme();
  const buttonRef = useRef();
  const isFocused = useSharedValue(false);
  const isHovered = useSharedValue(false);
  const isPressed = useSharedValue(false);
  const testID = providedTestID || dataTest || `button-${buttonType}`;

  const borderWidth = isDisabled ? 2 : 1;
  const type = useMemo(
    () => Object.values(ButtonType).find((type) => type === buttonType) ?? ButtonType.Primary,
    [buttonType]
  );

  const background = getBackground({ tokens, type });
  const borderColor = getBorderColor({ tokens, type });
  const color = getColor({ isDisabled, tokens, type });
  const hoverColor = getHoverColor({ tokens, type });
  const iconAdjustedMarginVertical = size === ButtonSize.Regular && -tokens.dimension[1];
  const iconSize = getIconSize({ size, tokens });
  const padding = getPadding({ borderWidth, size });

  const hasBorder = !!borderColor;

  const animatedStyle = useAnimatedStyle(() => {
    let state = isDisabled ? 'disabled' : 'default';

    if (isHovered.value) {
      state = 'hover';
    }

    if (isPressed.value) {
      state = 'pressed';
    }

    const currentBorderColor = borderColor?.[state] ?? 'transparent';

    return {
      backgroundColor: withTiming(background[state], AnimationConfig),
      borderColor: isFocused.value ? tokens.focus.default : withTiming(currentBorderColor, AnimationConfig),
      boxShadow: isFocused.value
        ? `0 0 0 1px ${tokens.focus.default}, inset 0 0 0 1px ${tokens.background.main}, inset 0 0 0 2px ${currentBorderColor}`
        : 'none',
    };
  }, [background, borderColor, hasBorder, isDisabled, tokens]);

  useEffect(() => {
    // Workaround to fix `onBlur` not running on certain occasions
    function handleFocus(event) {
      if (event.target !== buttonRef.current) {
        isFocused.value = false;
      }
    }

    window.addEventListener('focus', handleFocus, { capture: true });

    return () => {
      window.removeEventListener('focus', handleFocus, { capture: true });
    };
  }, [isFocused]);

  return (
    <AnimatedMixed
      alignItems="center"
      borderRadius="$border-radius-pill"
      borderStyle="solid"
      borderWidth={borderWidth}
      disabled={isLoading || isDisabled}
      display="flex"
      flexDirection="row"
      flexShrink={1}
      gap="$dimension-3"
      justifyContent="center"
      layoutWidth="100%"
      onBlur={() => (isFocused.value = false)}
      onClick={onPress ?? onClick}
      onFocus={() => (isFocused.value = true)}
      onMouseOut={() => (isHovered.value = false)}
      onMouseOver={() => (isHovered.value = true)}
      padding={padding}
      ref={buttonRef}
      role="button"
      style={animatedStyle}
      testID={testID}
      {...(!!centerIcon && getCircleStyles({ borderWidth, size, tokens, type }))}
      {...props}
    >
      {isLoading ? (
        <Animation
          animation="loadingSpinner"
          color={color}
          layoutHeight={iconSize.height}
          layoutWidth={iconSize.width}
          marginVertical={iconAdjustedMarginVertical}
          testID={`${testID}-loading`}
        />
      ) : (
        <ButtonContent
          centerIcon={centerIcon}
          color={color}
          hoverColor={hoverColor}
          iconAdjustedMarginVertical={iconAdjustedMarginVertical}
          isHovered={isHovered}
          leadingIcon={leadingIcon}
          size={size}
          testID={testID}
          trailingIcon={trailingIcon}
          type={type}
        >
          {children}
        </ButtonContent>
      )}
    </AnimatedMixed>
  );
};

Button.defaultProps = defaultProps;

Button.propTypes = propTypes;
