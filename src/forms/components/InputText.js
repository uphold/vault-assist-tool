import { getColor, getTypography } from '../../lib/theme/helpers';
import { getFormStatus, getFormVariant } from '../../lib/form';
import { theme } from '../../lib/theme';
import styled from 'styled-components';

export const InputText = styled.input`
  ${({ ...props }) => getColor(theme, 'input', getFormVariant(props), getFormStatus(props))};
  ${({ ...props }) => getTypography(theme, 'input', getFormVariant(props), getFormStatus(props))};
  border: 0;
  border-radius: 8px;
  box-sizing: border-box;
  margin: 0;
  padding: 12px 14px;
  transition: background-color 0.3s ease-in-out;
  width: 100%;

  ${({ disabled }) => disabled && { cursor: 'not-allowed' }}

  &:hover {
    ${({ ...props }) => getColor(theme, 'input', getFormVariant(props), getFormStatus({ ...props, ishovered: true }))};
  }

  &:focus {
    outline: 0;
  }

  &::placeholder {
    ${({ ...props }) => getColor(theme, 'placeholder', getFormVariant(props))};
  }
`;
