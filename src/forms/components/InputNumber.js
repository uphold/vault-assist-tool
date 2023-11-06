import { color, getColor, getTypography } from '../../lib/theme/helpers';
import { getFormStatus, getFormVariant } from '../../lib/form';
import { theme } from '../../lib/theme';
import Cleave from 'cleave.js/react';
import styled from 'styled-components';

export const InputNumber = styled(Cleave)`
  ${({ ...props }) => getColor(theme, 'input', getFormVariant(props), getFormStatus(props))};
  ${({ ...props }) => getTypography(theme, 'input', getFormVariant(props), getFormStatus(props))};
  border: 0;
  border-radius: 8px;
  box-sizing: border-box;
  margin: 0;
  padding: 12px 14px;
  width: 100%;

  &:hover {
    ${({ ...props }) => getColor(theme, 'input', getFormVariant(props), getFormStatus({ ...props, ishovered: true }))};
  }

  &:focus {
    outline: 0;
  }

  &::placeholder {
    ${color('placeholder')};
  }
`;
