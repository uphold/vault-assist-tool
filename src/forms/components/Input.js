import { Mixed } from '../../components/Mixed';
import { getFormStatus, getFormVariant } from '../../lib/form';
import styled from 'styled-components';

const Container = styled(Mixed.div)`
  box-sizing: border-box;
  transition: border-color 0.3s ease-in-out;

  ${({ isdisabled }) =>
    isdisabled
      ? `
          background-color: n02;
        `
      : `
          &:hover {
            border-color: n06;
          }
        `}
`;

const getBorderColor = props => {
  const status = getFormStatus(props);
  const variant = getFormVariant(props);

  if (variant === 'error') {
    return 'e06';
  }

  if (status === 'focus') {
    return 'n06';
  }

  return 'n04';
};

const getBorderWidth = props => {
  const variant = getFormVariant(props);

  if (variant === 'secondary') {
    return 0;
  }

  return 2;
};

export const Input = props => (
  <Container
    borderColor={getBorderColor(props)}
    borderRadius="rd02"
    borderStyle="solid"
    borderWidth={getBorderWidth(props)}
    {...props}
  />
);

Input.defaultProps = {
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'space-between',
  layoutPosition: 'relative'
};
