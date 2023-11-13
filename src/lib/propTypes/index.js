import { Blockchain } from '../vault';
import PropTypes from 'prop-types';

const Account = PropTypes.shape({
  address: PropTypes.string.isRequired,
  balance: PropTypes.string.isRequired,
  network: PropTypes.oneOf(Object.values(Blockchain)).isRequired,
  reserve: PropTypes.shape({
    baseReserve: PropTypes.number,
    ownerReserve: PropTypes.number,
    totalReserve: PropTypes.number,
  }),
});

const Destination = PropTypes.shape({
  destinationTag: PropTypes.string,
  fee: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
});

const CustomPropTypes = {
  Account,
  Destination,
};

export default CustomPropTypes;
