import { getColor, getTypography } from '../../lib/theme/helpers';
import { theme } from '../../lib/theme';
import mixins, { shouldForwardProp } from '../../lib/mixins';
import styled from 'styled-components';

export const H4 = styled.h4.withConfig({ shouldForwardProp })`
  ${getColor(theme, 'h4')};
  ${getTypography(theme, 'h4')};
  ${mixins};
`;
