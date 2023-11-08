import { Mixed } from '../Mixed';
import { Small } from '../Typography/Small';
import { Svg } from '../Svg';
import PropTypes from 'prop-types';

const ToastTypes = Object.freeze({
  alert: 'actionAlert',
  error: 'actionError',
  info: 'actionInfo',
  success: 'actionSuccess',
});

export const Toast = ({ message, type }) => (
  <Mixed.div alignItems="flex-start" backgroundColor="nd40" display="flex" padding="sp03">
    <Mixed.div marginRight="sp03">
      <Svg name={ToastTypes[type]} />
    </Mixed.div>

    <Small color="n05" data-test={`${type}Toast`} letterSpacing={0.2}>
      {message}
    </Small>
  </Mixed.div>
);

Toast.defaultProps = {
  type: 'info',
};

Toast.propTypes = {
  message: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
  type: PropTypes.oneOf(Object.keys(ToastTypes)),
};
