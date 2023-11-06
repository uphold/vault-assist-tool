import { createMixin } from './createMixin';

export const combine = (...mixins) => {
  const definitions = mixins.reduce((accumulator, mixin) => {
    if (!mixin.definitions) {
      return accumulator;
    }

    return { ...accumulator, ...mixin.definitions };
  }, {});

  return createMixin(definitions);
};
