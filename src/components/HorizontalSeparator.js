import { Mixed } from './Mixed';
import { styles } from '../lib/styles';

export const HorizontalSeparator = (props) => <Mixed.hr {...props} />;

HorizontalSeparator.defaultProps = {
  border: '0',
  borderTop: `1px solid ${styles.colors.nd50}`,
  layoutWidth: '100%',
  margin: 'sp03 0',
};
