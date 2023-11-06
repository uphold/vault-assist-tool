import { getColor, getTypography } from '../../lib/theme/helpers';
import { theme } from '../../lib/theme';
import mixins, { shouldForwardProp } from '../../lib/mixins';
import styled from 'styled-components';

export const XSmall = styled.p.withConfig({ shouldForwardProp })`
  ${getColor(theme, 'xsmall')};
  ${getTypography(theme, 'xsmall')};
  ${mixins};
`;
