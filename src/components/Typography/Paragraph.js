import { getColor, getTypography } from '../../lib/theme/helpers';
import { theme } from '../../lib/theme';
import mixins, { shouldForwardProp } from '../../lib/mixins';
import styled from 'styled-components';

export const Paragraph = styled.p.withConfig({ shouldForwardProp })`
  ${getColor(theme, 'paragraph')};
  ${getTypography(theme, 'paragraph')};
  ${mixins};
`;
