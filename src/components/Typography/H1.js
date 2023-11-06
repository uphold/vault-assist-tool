import { getColor, getTypography } from '../../lib/theme/helpers';
import { theme } from '../../lib/theme';
import mixins, { shouldForwardProp } from '../../lib/mixins';
import styled from 'styled-components';

export const H1 = styled.h1.withConfig({ shouldForwardProp })`
  ${getColor(theme, 'h1')};
  ${getTypography(theme, 'h1')};
  ${mixins};
`;
