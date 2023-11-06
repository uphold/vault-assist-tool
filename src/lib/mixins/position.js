import { createMixin } from './createMixin';
import { transformNumber } from './transformers';

export const positionDefinition = {
  layoutBottom: {
    properties: ['bottom'],
    transform: transformNumber(),
  },
  layoutLeft: {
    properties: ['left'],
    transform: transformNumber(),
  },
  layoutPosition: {
    properties: ['position'],
  },
  layoutRight: {
    properties: ['right'],
    transform: transformNumber(),
  },
  layoutTop: {
    properties: ['top'],
    transform: transformNumber(),
  },
  zIndex: {
    properties: ['zIndex'],
  },
};

export const position = createMixin(positionDefinition);
