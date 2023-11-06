import { getColor, getTypography } from '../../lib/theme/helpers';
import { theme } from '../../lib/theme';
import mixins, { shouldForwardProp } from '../../lib/mixins';
import styled from 'styled-components';

export const Small = styled.p.withConfig({ shouldForwardProp })`
  ${getColor(theme, 'small')};
  ${getTypography(theme, 'small')};
  ${mixins};
`;
