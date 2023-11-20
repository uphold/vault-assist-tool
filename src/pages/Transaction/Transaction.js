import { Animation } from '../../components/Animation';
import { CenterView } from '../../layouts';
import { colors } from '../../lib/styles';
import { useEffect } from 'react';
import PropTypes from 'prop-types';

export const Transaction = ({ submitTransaction }) => {
  useEffect(() => {
    window.requestAnimationFrame(async () => {
      // Make sure animation plays before we submit
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await submitTransaction();
    });
  }, []);

  return (
    <CenterView>
      <Animation
        animation="balloonLoading"
        animationOptions={{ loop: true }}
        color={colors.green20}
        layoutMaxWidth="100px"
      />
    </CenterView>
  );
};

Transaction.propTypes = {
  isGuarded: PropTypes.bool.isRequired,
  submitTransaction: PropTypes.func.isRequired,
};
