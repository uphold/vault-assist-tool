import { Mixed } from '../../components/Mixed';
import PropTypes from 'prop-types';

export const Row = ({ hasAlert, hasMessage, ...props }) => (
  <Mixed.div paddingBottom={hasAlert || hasMessage ? 0 : 18} paddingTop={8} {...props} />
);

Row.defaultProps = {
  hasAlert: false,
  hasMessage: false,
  layoutPosition: 'relative',
};

Row.propTypes = {
  hasAlert: PropTypes.bool,
  hasMessage: PropTypes.bool,
};
