import { getTypography } from '../../lib/theme/helpers';
import { theme } from '../../lib/theme';
import mixins, { shouldForwardProp } from '../../lib/mixins';
import styled from 'styled-components';

export const ButtonText = styled.button.withConfig({ shouldForwardProp })`
  ${getTypography(theme, 'button')};
  ${mixins};
`;
