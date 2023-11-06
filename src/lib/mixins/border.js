import { createMixin } from './createMixin';
import { transformBorder, transformColor, transformNumber, transformRadius } from './transformers';

export const borderDefinition = {
  border: {
    properties: ['border'],
    transform: transformBorder(),
  },
  borderBottom: {
    properties: ['border-bottom'],
    transform: transformBorder(),
  },
  borderBottomColor: {
    properties: ['border-bottom-color'],
    transform: transformColor(),
  },
  borderBottomLeftRadius: {
    properties: ['border-bottom-left-radius'],
    transform: transformRadius(),
  },
  borderBottomRadius: {
    properties: ['border-bottom-left-radius', 'border-bottom-right-radius'],
    transform: transformRadius(),
  },
  borderBottomRightRadius: {
    properties: ['border-bottom-right-radius'],
    transform: transformRadius(),
  },
  borderBottomStyle: {
    properties: ['border-bottom-style'],
  },
  borderBottomWidth: {
    properties: ['border-bottom-width'],
    transform: transformNumber(),
  },
  borderColor: {
    properties: ['border-color'],
    transform: transformColor(),
  },
  borderLeft: {
    properties: ['border-left'],
    transform: transformBorder(),
  },
  borderLeftColor: {
    properties: ['border-left-color'],
    transform: transformColor(),
  },
  borderLeftStyle: {
    properties: ['border-left-style'],
  },
  borderLeftWidth: {
    properties: ['border-left-width'],
    transform: transformNumber(),
  },
  borderRadius: {
    properties: ['border-radius'],
    transform: transformRadius(),
  },
  borderRight: {
    properties: ['border-right'],
    transform: transformBorder(),
  },
  borderRightColor: {
    properties: ['border-right-color'],
    transform: transformColor(),
  },
  borderRightStyle: {
    properties: ['border-right-style'],
  },
  borderRightWidth: {
    properties: ['border-right-width'],
    transform: transformNumber(),
  },
  borderStyle: {
    properties: ['border-style'],
  },
  borderTop: {
    properties: ['border-top'],
    transform: transformBorder(),
  },
  borderTopColor: {
    properties: ['border-top-color'],
    transform: transformColor(),
  },
  borderTopLeftRadius: {
    properties: ['border-top-left-radius'],
    transform: transformRadius(),
  },
  borderTopRadius: {
    properties: ['border-top-left-radius', 'border-top-right-radius'],
    transform: transformRadius(),
  },
  borderTopRightRadius: {
    properties: ['border-top-right-radius'],
    transform: transformRadius(),
  },
  borderTopStyle: {
    properties: ['border-top-style'],
  },
  borderTopWidth: {
    properties: ['border-top-width'],
    transform: transformNumber(),
  },
  borderWidth: {
    properties: ['border-width'],
    transform: transformNumber(),
  },
};

export const border = createMixin(borderDefinition);
