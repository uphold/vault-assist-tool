import { Mixed } from '../Mixed';
import { styles } from '../../lib/styles';

export const TableBox = props => (
  <Mixed.div {...props}>
    <Mixed.div {...props} border="0" padding="sp02 0" />
  </Mixed.div>
);

TableBox.defaultProps = {
  border: `1px solid ${styles.colors.nd50}`,
  borderRadius: 'rd04',
  padding: 'sp03'
};
