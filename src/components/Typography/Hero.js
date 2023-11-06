import { getColor, getTypography } from '../../lib/theme/helpers';
import { theme } from '../../lib/theme';
import mixins, { shouldForwardProp } from '../../lib/mixins';
import styled from 'styled-components';

export const Hero = styled.p.withConfig({ shouldForwardProp })`
  ${getColor(theme, 'hero')};
  ${getTypography(theme, 'hero')};
  ${mixins};
`;
