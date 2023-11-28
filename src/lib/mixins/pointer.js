import { createMixin } from './createMixin';

export const pointerDefinition = {
  pointerEvents: {
    properties: ['pointer-events']
  }
};

export const pointer = createMixin(pointerDefinition);
