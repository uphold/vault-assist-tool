import { Small } from '../Typography/Small';
import { styles } from '../../lib/styles';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const ActionText = styled(Small)`
  color: ${styles.colors.p06};
`;

export const NavigationActionText = ({ children, ...props }) => {
  return (
    <button {...props}>
      <ActionText fontWeight={600}>{children}</ActionText>
    </button>
  );
};

NavigationActionText.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired
};
