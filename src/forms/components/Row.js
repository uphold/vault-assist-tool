import { Mixed } from '../../components/Mixed';
import PropTypes from 'prop-types';

export const Row = ({ hasAlert, hasErrors, hasMessage, ...props }) => (
  <Mixed.div paddingBottom={hasAlert || hasErrors || hasMessage ? 0 : 18} paddingTop={8} {...props} />
);

Row.defaultProps = {
  hasAlert: false,
  hasErrors: false,
  hasMessage: false,
  layoutPosition: 'relative',
};

Row.propTypes = {
  hasAlert: PropTypes.bool,
  hasErrors: PropTypes.bool,
  hasMessage: PropTypes.bool,
};
