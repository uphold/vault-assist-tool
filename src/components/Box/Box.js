import { Mixed } from '../Mixed';
import styled from 'styled-components';

export const Box = styled(Mixed.div)`
  @media (min-width: 884px) {
    border-radius: 8px;
  }
`;

Box.defaultProps = {
  backgroundColor: 'n01',
  display: 'flex',
  flexDirection: 'column',
  layoutHeight: '100%',
  overflow: 'hidden'
};
