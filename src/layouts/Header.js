import { Mixed } from '../components/Mixed';
import styled from 'styled-components';

export const Header = styled(Mixed.div)`
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin-bottom: 8px;
`;

Header.defaultProps = {
  layoutMinHeight: '0',
  layoutMinWidth: '0',
  overflow: 'hidden'
};
