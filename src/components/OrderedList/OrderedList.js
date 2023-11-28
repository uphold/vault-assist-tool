import { Children, cloneElement } from 'react';
import { Mixed } from '../Mixed';
import PropTypes from 'prop-types';

export const OrderedList = ({ children, ...props }) => {
  const childrenArray = Children.toArray(children);

  return (
    <Mixed.div {...props}>
      {childrenArray.map((child, index) =>
        cloneElement(child, { ...child.props, key: index, marginTop: index > 0 ? 'sp03' : 0, number: index + 1 })
      )}
    </Mixed.div>
  );
};

OrderedList.propTypes = {
  children: PropTypes.node.isRequired
};
