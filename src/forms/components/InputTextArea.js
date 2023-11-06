import { InputText } from './InputText';
import styled from 'styled-components';

export const InputTextArea = styled(InputText).attrs(() => ({ as: 'textarea' }))`
  resize: vertical;
`;
