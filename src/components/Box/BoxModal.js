import { AnimatePresence } from 'framer-motion';
import { Box } from './Box';
import { Motion } from '../Motion';
import { styles } from '../../lib/styles';
import { useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled(Motion.div)`
  box-shadow: 0 8px 16px 0 ${styles.Utils.getColorWithOpacity(styles.colors.n045, 0.2)};

  @media (min-width: 884px) {
    border-radius: 8px;
  }
`;

export const BoxModal = ({ backgroundColor, children, hasInitialAnimation, isVisible, ...props }) => {
  const key = useMemo(() => uuidv4(), [isVisible]);

  return (
    <AnimatePresence initial={hasInitialAnimation}>
      {isVisible && (
        <Wrapper
          animate={{ opacity: 1, y: 0 }}
          backgroundColor="n01"
          exit={{ opacity: 0, y: '100%' }}
          initial={{ opacity: 0, y: '100%' }}
          key={key}
          layoutBottom="0"
          layoutLeft="0"
          layoutPosition="absolute"
          layoutRight="0"
          layoutTop="0"
          overflow="hidden"
          transition={{ mass: 0.5, stiffness: 80, type: 'spring' }}
          zIndex="10"
          {...props}
        >
          <Box backgroundColor={backgroundColor}>{children}</Box>
        </Wrapper>
      )}
    </AnimatePresence>
  );
};

BoxModal.defaultProps = {
  backgroundColor: '',
  hasInitialAnimation: false,
  isVisible: false
};

BoxModal.propTypes = {
  backgroundColor: PropTypes.string,
  children: PropTypes.node.isRequired,
  hasInitialAnimation: PropTypes.bool,
  isVisible: PropTypes.bool
};
