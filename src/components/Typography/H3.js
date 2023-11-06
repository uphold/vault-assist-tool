import { getColor, getTypography } from '../../lib/theme/helpers';
import { theme } from '../../lib/theme';
import mixins, { shouldForwardProp } from '../../lib/mixins';
import styled from 'styled-components';

export const H3 = styled.h3.withConfig({ shouldForwardProp })`
  ${getColor(theme, 'h3')};
  ${getTypography(theme, 'h3')}
  ${mixins};
`;
