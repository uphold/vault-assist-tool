import { useEffect } from 'react';

export const useAutoFocus = (ref, shouldFocus = true, onFocus = () => {}, delay) =>
  useEffect(() => {
    if (!shouldFocus || !ref?.current?.focus || document.activeElement === ref?.current) {
      return;
    }

    const timeout = setTimeout(() => {
      const { scrollLeft, scrollTop } = document.scrollingElement;

      ref?.current?.focus?.();

      document.scrollingElement.scrollTo(scrollLeft, scrollTop);

      onFocus();
    }, delay ?? 0);

    return () => {
      clearTimeout(timeout);
      ref?.current?.blur?.();
    };
  }, [shouldFocus]);
