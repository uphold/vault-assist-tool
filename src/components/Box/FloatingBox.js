import { AnimatePresence } from 'framer-motion';
import { Motion } from '../Motion';
import { memo } from 'react';
import PropTypes from 'prop-types';

const backgroundStyle = Object.freeze({
  bottom: { alignItems: 'flex-end' },
  center: { alignItems: 'center' },
  centerWindowed: { alignItems: 'center', justifyContent: 'center' },
  fullscreen: { alignItems: 'center', justifyContent: 'center', layoutPosition: 'fixed' }
});

const backgroundTransition = Object.freeze({
  bottom: { duration: 0.3 },
  center: { duration: 0.15 },
  centerWindowed: { duration: 0.15 },
  fullscreen: { duration: 0.15 }
});

const backgroundVariants = {
  exit: { opacity: 0 },
  initial: { opacity: 0 },
  visible: { opacity: 1 }
};

const boxStyle = Object.freeze({
  bottom: { borderRadius: 'rd05', flex: 1, marginBottom: '-16px', paddingBottom: 'sp07' },
  center: { borderRadius: 'rd03', flex: 1 },
  centerWindowed: { borderRadius: 'rd03', layoutHeight: '90%', layoutWidth: 'clamp(350px, 70%, 1000px)' },
  fullscreen: { borderRadius: 'rd03', flex: 1, layoutMaxWidth: '368px', marginLeft: 'var(--navigation-left-width)' }
});

const boxTransition = Object.freeze({
  bottom: { mass: 0.5, stiffness: 80, type: 'spring' },
  center: { duration: 0.28, ease: [0.25, 1, 0.5, 1] },
  centerWindowed: { duration: 0.28, ease: [0.25, 1, 0.5, 1] },
  fullscreen: { duration: 0.28, ease: [0.25, 1, 0.5, 1] }
});

const boxVariants = {
  exit: variant => (variant === 'bottom' ? { y: '200%' } : {}),
  initial: variant => (variant === 'bottom' ? { y: '200%' } : { scale: 1.1 }),
  visible: variant => (variant === 'bottom' ? { y: '0%' } : { scale: 1 })
};

const layoutTransition = Object.freeze({ bounce: 0.2, duration: 0.2, type: 'spring' });

export const FloatingBox = memo(({ children, isVisible, onRequestClose, variant, ...props }) => {
  const onClick = event => {
    if (event.currentTarget === event.target) {
      event.stopPropagation();
      onRequestClose();
    }
  };

  return (
    <AnimatePresence custom={variant}>
      {isVisible && (
        <Motion.div
          animate="visible"
          backgroundColor={['b01', 0.75]}
          borderRadius="rd01"
          display="flex"
          exit="exit"
          initial="initial"
          key="boxAlertWrapper"
          layoutBottom="0"
          layoutLeft="0"
          layoutPosition="absolute"
          layoutRight="0"
          layoutTop="0"
          onClick={onClick}
          overflow="hidden"
          padding="0"
          transition={backgroundTransition[variant]}
          variants={backgroundVariants}
          zIndex="100"
          {...backgroundStyle[variant]}
        >
          <Motion.div
            backgroundColor="n01"
            custom={variant}
            display="flex"
            key="boxAlertInnerWrapper"
            layoutMaxHeight="100%"
            onClick={onClick}
            overflow="hidden"
            transition={boxTransition[variant]}
            variants={boxVariants}
            {...boxStyle[variant]}
          >
            <Motion.div
              display="flex"
              flex="1"
              flexDirection="column"
              inherit={false}
              key="boxAlertContent"
              layout
              overflow="hidden"
              transition={layoutTransition}
              {...props}
            >
              {children}
            </Motion.div>
          </Motion.div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
});

FloatingBox.displayName = 'Memo(FloatingBox)';

FloatingBox.defaultProps = {
  onRequestClose: () => {}
};

FloatingBox.propTypes = {
  children: PropTypes.node.isRequired,
  isVisible: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func,
  variant: PropTypes.oneOf(Object.keys(backgroundStyle)).isRequired
};
