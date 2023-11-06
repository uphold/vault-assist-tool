import { createElement, forwardRef } from 'react';
import { isValidMotionProp } from 'framer-motion';
import mixins, { shouldForwardProp } from '../../lib/mixins';
import styled from 'styled-components';

const cache = new Map();

const baseComponent = styled.span?.withConfig({
  shouldForwardProp: (key, isDefaultProp) => !isValidMotionProp(key) && shouldForwardProp(key, isDefaultProp),
})(mixins);

const createMixed = (element) => {
  const component = forwardRef((props, ref) => createElement(baseComponent, { as: element, ref, ...props }));

  component.displayName = `Mixed(${element?.displayName || element?.name || element})`;

  return component;
};

export const Mixed = new Proxy(
  (type, options) => {
    const isTag = typeof type === 'string';

    const element = isTag ? type.toLowerCase() : type;
    const { useCache } = options || {};

    if (useCache && isTag && cache.has(element)) {
      return cache.get(element);
    }

    const component = createMixed(element);

    if (useCache && isTag) {
      cache.set(element, component);
    }

    return component;
  },
  {
    get: (target, prop) => {
      if (prop === 'prototype') {
        return target.prototype;
      }

      if (prop === 'name') {
        return 'Mixed';
      }

      return target(prop, { useCache: true });
    },
  }
);
