import { ButtonSize, ButtonType, getIconSize } from './lib';
import { Svg } from '../Svg';
import { forwardRef } from 'react';
import { useTheme } from '../../hooks/useTheme';
import PropTypes from 'prop-types';

export const ButtonIcon = forwardRef(({ icon, size, type, ...props }, ref) => {
  const { tokens } = useTheme();

  if (typeof icon !== 'string') {
    return icon;
  }

  return (
    <Svg
      height={getIconSize({ size, tokens, type }).height}
      name={icon}
      ref={ref}
      width={getIconSize({ size, tokens, type }).width}
      {...props}
    />
  );
});

ButtonIcon.defaultProps = {
  type: undefined
};

ButtonIcon.displayName = 'ButtonIcon';

ButtonIcon.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  size: PropTypes.oneOf(Object.values(ButtonSize)).isRequired,
  type: PropTypes.oneOf(Object.values(ButtonType))
};
