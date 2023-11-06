import mixins, { shouldForwardProp } from '../../lib/mixins';
import styled from 'styled-components';

export const Semibold = styled.strong.withConfig({ shouldForwardProp })`
  ${mixins};
`;

Semibold.defaultProps = {
  fontWeight: 600,
};
