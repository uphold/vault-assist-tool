import { createMixin } from './createMixin';
import { transformColor } from './transformers';

export const colorDefinition = {
  background: {
    properties: ['background'],
    transform: transformColor(),
  },
  backgroundColor: {
    properties: ['background-color'],
    transform: transformColor(),
  },
  color: {
    properties: ['color'],
    transform: transformColor(),
  },
  opacity: {
    properties: ['opacity'],
  },
};

export const color = createMixin(colorDefinition);
