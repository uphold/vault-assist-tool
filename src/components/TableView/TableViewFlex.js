import { Mixed } from '../Mixed';

export const TableViewFlex = (props) => <Mixed.div {...props} />;

TableViewFlex.defaultProps = {
  alignItems: 'flex-start',
  display: 'flex',
  justifyContent: 'space-between',
  layoutPosition: 'relative',
};
