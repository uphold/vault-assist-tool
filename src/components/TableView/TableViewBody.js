import { Mixed } from '../Mixed';

export const TableViewBody = props => <Mixed.div {...props} />;

TableViewBody.defaultProps = {
  alignItems: 'flex-start',
  display: 'flex',
  justifyContent: 'space-between',
  layoutPosition: 'relative'
};
