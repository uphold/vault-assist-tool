import { forwardRef } from 'react';

export default 'Svgr';

const Svgr = forwardRef((props, ref) => <span ref={ref} {...props} />);

Svgr.displayName = 'Svgr';

export const ReactComponent = Svgr;
