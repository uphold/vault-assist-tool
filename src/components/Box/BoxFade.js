import { AnimatePresence } from 'framer-motion';
import { Motion } from '../Motion';
import { styles } from '../../lib/styles';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled(Motion.div)`
  @supports (backdrop-filter: none) {
    backdrop-filter: blur(10px);
    background: ${styles.Utils.getColorWithOpacity(styles.colors.n01, 0.8)};
  }
`;

export const BoxFade = ({ children, isVisible, ...props }) => (
  <AnimatePresence>
    {isVisible && (
      <Wrapper
        animate={{ opacity: 1 }}
        background="n01"
        borderRadius="rd02"
        display="flex"
        exit={{ opacity: 0 }}
        flexDirection="column"
        initial={{ opacity: 0 }}
        layoutBottom="0"
        layoutLeft="0"
        layoutPosition="absolute"
        layoutRight="0"
        layoutTop="0"
        overflowY="auto"
        padding="sp05"
        transaction={{ duration: 0.3 }}
        zIndex="100"
        {...props}
      >
        {children}
      </Wrapper>
    )}
  </AnimatePresence>
);

BoxFade.defaultProps = {
  isVisible: false
};

BoxFade.propTypes = {
  children: PropTypes.node.isRequired,
  isVisible: PropTypes.bool
};
