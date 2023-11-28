import { createMixin } from './createMixin';
import { transformColor, transformNumber, transformString } from './transformers';

export const layoutDefinition = {
  boxShadow: {
    properties: ['box-shadow'],
    transform: transformColor()
  },
  boxSizing: {
    properties: ['box-sizing']
  },
  cursor: {
    properties: ['cursor']
  },
  display: {
    properties: ['display']
  },
  grid: {
    properties: ['grid']
  },
  gridArea: {
    properties: ['grid-area']
  },
  gridAutoColumns: {
    properties: ['grid-auto-columns']
  },
  gridAutoFlow: {
    properties: ['grid-auto-flow']
  },
  gridAutoRows: {
    properties: ['grid-auto-rows']
  },
  gridColumn: {
    properties: ['grid-column']
  },
  gridColumnEnd: {
    properties: ['grid-column-end']
  },
  gridColumnStart: {
    properties: ['grid-column-start']
  },
  gridRow: {
    properties: ['grid-row']
  },
  gridRowEnd: {
    properties: ['grid-row-end']
  },
  gridRowStart: {
    properties: ['grid-row-start']
  },
  gridTemplate: {
    properties: ['grid-template']
  },
  gridTemplateAreas: {
    properties: ['grid-template-areas'],
    transform: transformString()
  },
  gridTemplateColumns: {
    properties: ['grid-template-columns']
  },
  gridTemplateRows: {
    properties: ['grid-template-rows']
  },
  layoutHeight: {
    properties: ['height'],
    transform: transformNumber()
  },
  layoutMaxHeight: {
    properties: ['maxHeight'],
    transform: transformNumber()
  },
  layoutMaxWidth: {
    properties: ['maxWidth'],
    transform: transformNumber()
  },
  layoutMinHeight: {
    properties: ['minHeight'],
    transform: transformNumber()
  },
  layoutMinWidth: {
    properties: ['minWidth'],
    transform: transformNumber()
  },
  layoutSize: {
    properties: ['height', 'width'],
    transform: transformNumber()
  },
  layoutWidth: {
    properties: ['width'],
    transform: transformNumber()
  },
  overflow: {
    properties: ['overflow']
  },
  overflowX: {
    properties: ['overflowX']
  },
  overflowY: {
    properties: ['overflowY']
  },
  scrollPadding: {
    properties: ['scroll-padding'],
    transform: transformNumber()
  },
  scrollPaddingBottom: {
    properties: ['scroll-padding-bottom'],
    transform: transformNumber()
  },
  scrollPaddingLeft: {
    properties: ['scroll-padding-left'],
    transform: transformNumber()
  },
  scrollPaddingRight: {
    properties: ['scroll-padding-right'],
    transform: transformNumber()
  },
  scrollPaddingTop: {
    properties: ['scroll-padding-top'],
    transform: transformNumber()
  },
  verticalAlign: {
    properties: ['verticalAlign']
  }
};

export const layout = createMixin(layoutDefinition);
