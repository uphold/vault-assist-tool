import { Icon } from '../Icon';
import { Motion } from '../Motion';
import { styles } from '../../lib/styles';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const NavigationButton = styled(Motion.button)`
  ${({ isDisabled }) => isDisabled && `cursor: default;`}
`;

const colors = {
  green: {
    background: styles.Utils.getColorWithOpacity(styles.colors.p06, 0.16),
    backgroundDisabled: styles.Utils.getColorWithOpacity(styles.colors.p06, 0.48),
    backgroundHover: styles.Utils.getColorWithOpacity(styles.colors.p06, 0.32),
    color: styles.colors.p06,
    colorDisabled: styles.Utils.getColorWithOpacity(styles.colors.p06, 0.08)
  },
  neutral: {
    background: styles.colors.nd50,
    backgroundDisabled: styles.colors.nd40,
    backgroundHover: styles.colors.nd60,
    color: styles.colors.n04,
    colorDisabled: styles.colors.n06
  }
};

export const NavigationAction = ({ color, iconProps, isDisabled, name, theme, ...props }) => {
  const icon = <Icon color={color} name={name} size={20} {...iconProps} />;

  if (!icon) {
    return null;
  }

  return (
    <NavigationButton
      alignItems="center"
      animate={isDisabled ? 'disabled' : 'default'}
      borderRadius="50%"
      data-test={name}
      disabled={isDisabled}
      display="flex"
      initial={false}
      isDisabled={isDisabled}
      justifyContent="center"
      layoutHeight="40px"
      layoutWidth="40px"
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      variants={{
        default: { backgroundColor: colors[theme]?.background, color: colors[theme]?.color },
        disabled: { backgroundColor: colors[theme]?.backgroundDisabled, color: colors[theme]?.colorDisabled }
      }}
      whileHover={!isDisabled && { backgroundColor: colors[theme]?.backgroundHover }}
      whileTap={!isDisabled && { scale: 0.92 }}
      {...props}
    >
      {icon}
    </NavigationButton>
  );
};

NavigationAction.defaultProps = {
  color: 'currentColor',
  iconProps: {},
  isDisabled: false,
  theme: 'neutral'
};

NavigationAction.propTypes = {
  color: PropTypes.string,
  iconProps: PropTypes.object,
  isDisabled: PropTypes.bool,
  name: PropTypes.string.isRequired,
  theme: PropTypes.string
};
