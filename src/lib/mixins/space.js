import { combine } from './combine';
import { createMixin } from './createMixin';
import { transformSpace } from './transformers';

export const marginDefinition = {
  margin: {
    properties: ['margin'],
    transform: transformSpace(),
  },
  marginBottom: {
    properties: ['marginBottom'],
    transform: transformSpace(),
  },
  marginHorizontal: {
    properties: ['marginLeft', 'marginRight'],
    transform: transformSpace(),
  },
  marginLeft: {
    properties: ['marginLeft'],
    transform: transformSpace(),
  },
  marginRight: {
    properties: ['marginRight'],
    transform: transformSpace(),
  },
  marginTop: {
    properties: ['marginTop'],
    transform: transformSpace(),
  },
  marginVertical: {
    properties: ['marginBottom', 'marginTop'],
    transform: transformSpace(),
  },
};

export const paddingDefinition = {
  padding: {
    properties: ['padding'],
    transform: transformSpace(),
  },
  paddingBottom: {
    properties: ['paddingBottom'],
    transform: transformSpace(),
  },
  paddingHorizontal: {
    properties: ['paddingLeft', 'paddingRight'],
    transform: transformSpace(),
  },
  paddingLeft: {
    properties: ['paddingLeft'],
    transform: transformSpace(),
  },
  paddingRight: {
    properties: ['paddingRight'],
    transform: transformSpace(),
  },
  paddingTop: {
    properties: ['paddingTop'],
    transform: transformSpace(),
  },
  paddingVertical: {
    properties: ['paddingBottom', 'paddingTop'],
    transform: transformSpace(),
  },
};

export const margin = createMixin(marginDefinition);
export const padding = createMixin(paddingDefinition);
export const space = combine(margin, padding);
