import { Mixed } from '../Mixed';
import { Small } from '../Typography/Small';
import { XSmall } from '../Typography/XSmall';
import PropTypes from 'prop-types';

//  display: flex;
// flex-direction: row;
// flex-wrap: nowrap;
// justify-content: normal;
// align-items: normal;
// align-content: normal;
export const OrderedListItem = ({ children, number, ...props }) => (
  <Mixed.div display="flex" {...props}>
    <Mixed.div
      alignItems="center"
      border="2px solid n03"
      borderRadius="50%"
      boxSizing="border-box"
      display="flex"
      flexShrink="0"
      justifyContent="center"
      layoutHeight={22}
      layoutWidth={22}
    >
      <XSmall alignItems="center" color="n07" fontWeight={700} justifyContent="center">
        {number}
      </XSmall>
    </Mixed.div>

    <Small fontWeight="200" marginLeft="12px" paddingTop="1px">
      {children}
    </Small>
  </Mixed.div>
);

OrderedListItem.defaultProps = {
  number: null,
};

OrderedListItem.propTypes = {
  children: PropTypes.node.isRequired,
  number: PropTypes.number,
};
