import { Mixed } from '../Mixed';
import { Small } from '../Typography/Small';
import { XSmall } from '../Typography/XSmall';
import PropTypes from 'prop-types';

export const OrderedListItem = ({ children, number, ...props }) => (
  <Mixed.div alignItems="center" display="flex" {...props}>
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

    <Small color="n07" letterSpacing={0.2} marginLeft="sp03">
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
