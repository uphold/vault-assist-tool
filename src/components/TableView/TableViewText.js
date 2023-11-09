import { H4 } from '../Typography/H4';
import { styles } from '../../lib/styles';

export const TableViewText = (props) => <H4 {...props} />;

TableViewText.defaultProps = {
  color: styles.colors.n045,
  fontWeight: 400,
  marginTop: '2px',
  wordBreak: 'break-word',
};
