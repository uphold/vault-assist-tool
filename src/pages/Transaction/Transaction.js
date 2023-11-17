import { Animation } from '../../components/Animation';
import { Mixed } from '../../components/Mixed';
import { colors } from '../../lib/styles';
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

export const Center = styled(Mixed.div)`
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  justify-items: center;
  grid-area: content;
`;

export const Transaction = ({ submitTransaction }) => {
  useEffect(() => {
    window.requestAnimationFrame(async () => {
      // Make sure animation plays before we submit
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await submitTransaction();
    });
  }, []);

  return (
    <Center>
      <Animation
        animation="balloonLoading"
        animationOptions={{ loop: true }}
        color={colors.green20}
        layoutMaxWidth="100px"
      />
    </Center>
  );
};

Transaction.propTypes = {
  isGuarded: PropTypes.bool.isRequired,
  submitTransaction: PropTypes.func.isRequired,
};
