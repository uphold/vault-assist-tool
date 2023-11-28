import { createMixin } from './createMixin';
import { transformSpace } from './transformers';

export const flexDefinition = {
  alignContent: {
    properties: ['alignContent']
  },
  alignItems: {
    properties: ['alignItems']
  },
  alignSelf: {
    properties: ['alignSelf']
  },
  flex: {
    properties: ['flex']
  },
  flexBasis: {
    properties: ['flexBasis']
  },
  flexDirection: {
    properties: ['flexDirection']
  },
  flexGrow: {
    properties: ['flexGrow']
  },
  flexShrink: {
    properties: ['flexShrink']
  },
  flexWrap: {
    properties: ['flexWrap']
  },
  gap: {
    properties: ['gap'],
    transform: transformSpace()
  },
  justifyContent: {
    properties: ['justifyContent']
  },
  justifyItems: {
    properties: ['justifyItems']
  },
  justifySelf: {
    properties: ['justifySelf']
  },
  order: {
    properties: ['order']
  }
};

export const flex = createMixin(flexDefinition);
