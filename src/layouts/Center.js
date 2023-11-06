import { Mixed } from '../components/Mixed';
import styled from 'styled-components';

export const Center = styled(Mixed.div)`
  display: flex;
  flex-direction: column;
  padding: 48px 8px;
  text-align: center;
  justify-content: center;
  align-items: center;
  @media (min-height: 600px) {
    @media (min-width: 884px) {
      padding: 48px 32px;
      grid-template-rows: 0fr 1fr 0;
    }
  }
`;

Center.defaultProps = {
  layoutMinHeight: '0',
  layoutMinWidth: '0',
  overflow: 'hidden',
};
