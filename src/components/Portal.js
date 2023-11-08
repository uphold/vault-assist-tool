import { useMemo } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

export const Portal = ({ children, node, id }) => {
  const target = useMemo(() => {
    if (node) {
      return node;
    }

    return document && document.getElementById(id);
  }, [node, id]);

  if (!target) {
    console.log('invalid target');

    return null;
  }

  return ReactDOM.createPortal(children, target);
};

Portal.defaultProps = {
  id: undefined,
  node: undefined,
};

Portal.propTypes = {
  children: PropTypes.node.isRequired,
  id: PropTypes.string,
  node: PropTypes.object,
};
