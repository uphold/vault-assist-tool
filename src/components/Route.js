import { Route as BaseRoute, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

const RouteComponent = ({ component: Component, ...props }) => (
  <BaseRoute {...props} render={componentProps => <Component {...props} {...componentProps} />} />
);

RouteComponent.defaultProps = {
  component: () => null
};

RouteComponent.propTypes = {
  component: PropTypes.elementType
};

export const Route = withRouter(RouteComponent);
