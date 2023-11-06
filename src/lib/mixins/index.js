import { border } from './border';
import { color } from './color';
import { combine } from './combine';
import { flex } from './flex';
import { layout } from './layout';
import { margin, padding, space } from './space';
import { pointer } from './pointer';
import { position } from './position';
import { typography } from './typography';
import helpers from './helpers';

const mixins = combine(border, color, flex, layout, margin, padding, pointer, position, space, typography);

export const shouldForwardProp = (prop, isDefaultProp) =>
  (!isDefaultProp || isDefaultProp(prop)) && !helpers.isPropFromMixin(mixins, prop);

export * from './border';
export * from './color';
export * from './combine';
export * from './createMixin';
export * from './flex';
export * from './layout';
export * from './pointer';
export * from './position';
export * from './space';
export * from './typography';
export { default as helpers } from './helpers';
export { default as transformers } from './transformers';
export default mixins;
