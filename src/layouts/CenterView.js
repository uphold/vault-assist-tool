import { Mixed } from '../components/Mixed';
import styled from 'styled-components';

export const CenterView = styled(Mixed.div)`
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  justify-items: center;
  grid-area: content;
`;

CenterView.defaultProps = {
  layoutMinHeight: '0',
  layoutMinWidth: '0',
  overflow: 'hidden'
};
