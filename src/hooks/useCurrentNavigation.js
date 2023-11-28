import { matchPath, useLocation } from 'react-router';
import { useEffect, useState } from 'react';

const getCurrentNavigation = (navigationItems, pathname, ...extraItems) => {
  const allItems = navigationItems.concat(extraItems).reduce((result, { shownActive = [], ...item }) => {
    result.push(item);

    shownActive.forEach(path => result.push({ ...item, path }));

    return result;
  }, []);

  return allItems
    .filter(item => matchPath(pathname, item))
    .reduce((previous, current) => (previous?.path?.includes(current.path) ? previous : current), null);
};

export const useCurrentNavigation = (navigationItems, ...extraItems) => {
  const { pathname } = useLocation();
  const [currentNavigation, setCurrentNavigation] = useState(
    () => getCurrentNavigation(navigationItems, pathname, ...extraItems)?.name
  );

  useEffect(() => {
    const currentNavigation = getCurrentNavigation(navigationItems, pathname, ...extraItems);

    setCurrentNavigation(currentNavigation?.name);
  }, [navigationItems, pathname]);

  return [currentNavigation, setCurrentNavigation];
};
