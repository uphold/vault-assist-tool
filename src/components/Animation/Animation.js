import { Mixed } from '../Mixed';
import { useCurrent } from '../../hooks/useCurrent';
import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import animations from './animations';
import lottie from 'lottie-web';
import mixins from '../../lib/mixins';
import styled from 'styled-components';

const Wrapper = styled(Mixed.div)`
  svg {
    ${({ svgStyle }) => mixins(svgStyle)}
  }

  svg path {
    stroke: currentColor;
    fill: currentColor;
    color: currentColor;
  }
`;

export const Animation = ({ animation, animationOptions, isActive, onComplete, onDestroy, ...props }) => {
  const animationRef = useRef();
  const callbacks = useCurrent({
    onComplete,
    onDestroy,
  });
  const ref = useRef();

  useEffect(() => {
    const animationInstance = lottie.loadAnimation({
      animationData: typeof animation?.valueOf() === 'string' ? animations[animation] : animation,
      autoplay: false,
      container: ref.current,
      loop: true,
      renderer: 'svg',
      ...animationOptions,
      rendererSettings: {
        viewBoxOnly: true,
        ...(animationOptions?.rendererSettings || {}),
      },
    });

    let completed = false;

    animationInstance.onComplete = () => {
      completed = true;

      callbacks.current.onComplete(animationInstance);
    };

    animationInstance.onDestroy = async () => {
      if (!completed) {
        await callbacks.current.onComplete(animationInstance);
      }

      callbacks.current.onDestroy(animationInstance);
    };

    animationRef.current = animationInstance;

    return () => {
      animationInstance.destroy();
    };
  }, [animation, animationOptions, callbacks]);

  useEffect(() => {
    if (isActive) {
      animationRef.current?.play();

      return () => {
        // Only stop if there's still an element on the DOM
        // eslint-disable-next-line react-hooks/exhaustive-deps
        if (ref.current) {
          animationRef.current.stop();
        }
      };
    }
  }, [isActive]);

  return <Wrapper ref={ref} {...props} />;
};

Animation.defaultProps = {
  animationOptions: {},
  isActive: true,
  onComplete: () => {},
  onDestroy: () => {},
  svgStyle: {
    layoutHeight: '100%',
    layoutWidth: '100%',
  },
};

Animation.propTypes = {
  animation: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  animationOptions: PropTypes.object,
  isActive: PropTypes.bool,
  onComplete: PropTypes.func,
  onDestroy: PropTypes.func,
};
