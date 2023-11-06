import { getColor, getTypography } from '../../lib/theme/helpers';
import { theme } from '../../lib/theme';
import mixins, { shouldForwardProp } from '../../lib/mixins';
import styled from 'styled-components';

export const H2 = styled.h2.withConfig({ shouldForwardProp })`
  ${getColor(theme, 'h2')};
  ${getTypography(theme, 'h2')};
  ${mixins};
`;
