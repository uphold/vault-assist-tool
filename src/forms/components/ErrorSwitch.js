import { Children, memo } from 'react';
import { Mixed } from '../../components/Mixed';
import PropTypes from 'prop-types';

export const ErrorSwitch = memo(({ children, errors }) => {
  if (!errors) {
    return null;
  }

  const childrenArr = Children.toArray(children);

  const child = childrenArr.find((child) => child.props.type && [errors.code, errors.type].includes(child.props.type));

  if (child) {
    return child;
  }

  return childrenArr.find((child) => typeof child.props.type === 'undefined') || <Mixed.div layoutHeight={32} />;
});

ErrorSwitch.defaultProps = {
  children: undefined,
  errors: undefined,
};

ErrorSwitch.displayName = 'Memo(ErrorSwitch)';

ErrorSwitch.propTypes = {
  children: PropTypes.node,
  errors: PropTypes.shape({
    code: PropTypes.string,
    type: PropTypes.string,
  }),
};
