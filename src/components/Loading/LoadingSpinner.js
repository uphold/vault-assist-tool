import { Motion } from '../Motion';
import { styles } from '../../lib/styles';
import PropTypes from 'prop-types';

export const LoadingSpinner = ({ size, ...props }) => (
  <Motion.svg
    animate={{ rotateZ: 360 }}
    data-test="loading"
    height={size}
    transition={{ duration: 1.2, ease: 'linear', repeat: Infinity, repeatType: 'loop' }}
    viewBox="0 0 100 100"
    width={size}
    {...props}
  >
    <circle
      cx="50"
      cy="50"
      fill="transparent"
      r="45"
      stroke={styles.colors.p06}
      strokeDasharray="180"
      strokeLinecap="round"
      strokeWidth="10px"
    />
  </Motion.svg>
);

LoadingSpinner.defaultProps = {
  size: 32,
};

LoadingSpinner.propTypes = {
  size: PropTypes.number,
};
