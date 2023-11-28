import { Small } from '../Typography/Small';

export const TableViewMessage = props => <Small {...props} />;

TableViewMessage.defaultProps = {
  fontWeight: 600,
  marginTop: '2px',
  wordBreak: 'break-word'
};
