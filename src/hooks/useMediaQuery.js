import { useEffect, useMemo, useState } from 'react';

export const useMediaQuery = (mediaQuery) => {
  const query = useMemo(() => window.matchMedia(mediaQuery), [mediaQuery]);
  const [matches, setMatches] = useState(() => query.matches);

  useEffect(() => {
    const onMediaMatch = ({ matches }) => setMatches(matches);

    try {
      query.addEventListener('change', onMediaMatch);
    } catch (error) {
      try {
        query.addListener(onMediaMatch);
        // eslint-disable-next-line no-empty
      } catch (error) {}
    }

    return () => {
      try {
        query.removeEventListener('change', onMediaMatch);
      } catch (error) {
        try {
          query.removeListener(onMediaMatch);
          // eslint-disable-next-line no-empty
        } catch (error) {}
      }
    };
  }, [query]);

  return matches;
};

export const useIsDesktop = () => useMediaQuery('(min-width: 1280px)');

export const useIsMobile = () => useMediaQuery('(max-width: 883px)');

export const useIsTablet = () => useMediaQuery('(min-width: 884px) and (max-width: 1279px)');
