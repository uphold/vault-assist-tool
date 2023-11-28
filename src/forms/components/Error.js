import { XSmall } from '../../components/Typography/XSmall';
import { color } from '../../lib/theme/helpers';
import styled from 'styled-components';

export const Error = styled(XSmall)`
  ${color('error')};
`;

Error.defaultProps = {
  padding: '4px 16px 12px'
};
