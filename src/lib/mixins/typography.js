import { createMixin } from './createMixin';
import { transformColor, transformNumber } from './transformers';

export const typographyDefinition = {
  fontFamily: {
    properties: ['font-family'],
  },
  fontSize: {
    properties: ['fontSize'],
    transform: transformNumber(),
  },
  fontStyle: {
    properties: ['font-style'],
  },
  fontWeight: {
    properties: ['fontWeight'],
  },
  letterSpacing: {
    properties: ['letterSpacing'],
    transform: transformNumber(),
  },
  lineBreak: {
    properties: ['line-break'],
  },
  lineHeight: {
    properties: ['lineHeight'],
    transform: transformNumber(),
  },
  overflowWrap: {
    properties: ['overflow-wrap'],
  },
  textAlign: {
    properties: ['textAlign'],
  },
  textDecoration: {
    properties: ['text-decoration'],
  },
  textDecorationColor: {
    properties: ['text-decoration-color'],
    transform: transformColor(),
  },
  textDecorationLine: {
    properties: ['text-decoration-line'],
  },
  textDecorationStyle: {
    properties: ['text-decoration-style'],
  },
  textIndent: {
    properties: ['text-indent'],
  },
  textOverflow: {
    properties: ['text-overflow'],
  },
  textTransform: {
    properties: ['text-transform'],
  },
  whiteSpace: {
    properties: ['white-space'],
  },
  wordBreak: {
    properties: ['word-break'],
  },
  wordSpacing: {
    properties: ['word-spacing'],
    transform: transformNumber(),
  },
};

export const typography = createMixin(typographyDefinition);
