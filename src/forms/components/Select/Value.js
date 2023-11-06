import { getColor, getTypography } from '../../../lib/theme/helpers';
import { getFormStatus, getFormVariant } from '../../../lib/form';
import styled from 'styled-components';

export const Value = styled.p`
  ${({ theme, ...props }) => getColor(theme, 'input', getFormVariant(props), getFormStatus(props))};
  ${({ theme, ...props }) => getTypography(theme, 'input', getFormVariant(props), getFormStatus(props))};
  flex: 1;
`;
