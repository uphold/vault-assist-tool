import { LoadingSpinner } from './Loading/LoadingSpinner';
import { LoadingWrapper } from './Loading/LoadingWrapper';
import { Mixed } from './Mixed';
import { ScrollProvider } from '../context/scrollContext/ScrollContext';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { useEffectOnce } from '../hooks/useEffectOnce';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled(Mixed.div)`
  scroll-padding-bottom: 64px;
  scroll-snap-align: start;

  & > * {
    flex-shrink: 0;
  }

  @-moz-document url-prefix() {
    padding-bottom: 0;

    &::after {
      content: '';
      padding-bottom: 32px;
    }
  }
`;

export const ScrollableSection = forwardRef(({ as, children, isLoading, onEndReached, ...props }, ref) => {
  const hasReachedEndRef = useRef(false);
  const onEndReachedRef = useRef(onEndReached);
  const timeoutRef = useRef();
  const wrapperRef = useRef();

  useImperativeHandle(ref, () => wrapperRef.current, []);
  useImperativeHandle(onEndReachedRef, () => onEndReached, [onEndReached]);

  useEffectOnce(() => {
    const callbackListener = ({ target: { clientHeight, scrollHeight, scrollTop } }) => {
      if (scrollHeight - clientHeight - scrollTop <= 200 && !hasReachedEndRef.current) {
        hasReachedEndRef.current = true;

        timeoutRef.current = setTimeout(() => {
          hasReachedEndRef.current = false;
        }, 300);

        onEndReachedRef.current();
      }
    };

    wrapperRef.current?.addEventListener('scroll', callbackListener);

    return () => {
      clearTimeout(timeoutRef.current);
      wrapperRef.current?.removeEventListener('scroll', callbackListener);
    };
  });

  return (
    <Wrapper forwardedAs={as} ref={wrapperRef} {...props}>
      <ScrollProvider value={wrapperRef}>
        {!isLoading ? (
          children
        ) : (
          <LoadingWrapper>
            <LoadingSpinner />
          </LoadingWrapper>
        )}
      </ScrollProvider>
    </Wrapper>
  );
});

ScrollableSection.defaultProps = {
  as: undefined,
  display: 'flex',
  flex: '1',
  flexDirection: 'column',
  hasNextPage: false,
  isLoading: false,
  layoutPosition: 'relative',
  onEndReached: () => {},
  overflowY: 'auto',
};

ScrollableSection.displayName = 'forwardRef(ScrollableSection)';

ScrollableSection.propTypes = {
  as: PropTypes.any,
  children: PropTypes.node.isRequired,
  hasNextPage: PropTypes.bool,
  isLoading: PropTypes.bool,
  onEndReached: PropTypes.func,
};
