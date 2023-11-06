import { getColor, getTypography } from '../../lib/theme/helpers';
import { theme } from '../../lib/theme';
import mixins, { shouldForwardProp } from '../../lib/mixins';
import styled from 'styled-components';

export const Code = styled.p.withConfig({ shouldForwardProp })`
  ${getColor(theme, 'code')};
  ${getTypography(theme, 'code')};
  ${mixins};
`;
