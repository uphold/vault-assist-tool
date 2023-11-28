import { Mixed } from '../components/Mixed';
import styled from 'styled-components';

export const Content = styled(Mixed.div)`
  padding-bottom: 16px;
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 16px;
  ${({ paddingTop }) => paddingTop && { paddingTop }}
  ${({ paddingBottom }) => paddingBottom && { paddingBottom }}

  @media (min-height: 600px) {
    @media (min-width: 884px) {
      padding-bottom: 24px;
      padding-left: 24px;
      padding-right: 24px;
      padding-top: 24px;
      ${({ paddingTop }) => paddingTop && { paddingTop }}
      ${({ paddingBottom }) => paddingBottom && { paddingBottom }}
    }
  }
`;

Content.defaultProps = {
  layoutMinHeight: '0',
  layoutMinWidth: '0',
  overflow: 'hidden'
};
