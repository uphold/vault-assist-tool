import { Mixed } from './Mixed';
import { motion } from 'framer-motion';

const cache = new Map();
const createMotion = (element, options) => {
  // eslint-disable-next-line new-cap
  const component = motion(Mixed(element, options), { forwardMotionProps: true });

  component.displayName = `Motion(${element?.displayName || element?.name || element})`;

  return component;
};

export const Motion = new Proxy(
  (type, options) => {
    const isTag = typeof type === 'string';

    const element = isTag ? type.toLowerCase() : type;
    const { useCache } = options || {};

    if (useCache && isTag && cache.has(element)) {
      return cache.get(element);
    }

    const component = createMotion(element, options);

    if (useCache && isTag) {
      cache.set(element, component);
    }

    return component;
  },
  { get: (getMotion, element) => getMotion(element, { useCache: true }) }
);
