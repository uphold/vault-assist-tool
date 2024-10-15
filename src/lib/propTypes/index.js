import { Blockchain } from '../vault';
import PropTypes from 'prop-types';

const ReserveAmounts = PropTypes.shape({
  baseReserve: PropTypes.string,
  ownerReserve: PropTypes.string,
  totalReserve: PropTypes.string
});

const Account = PropTypes.shape({
  address: PropTypes.string.isRequired,
  balance: PropTypes.string.isRequired,
  network: PropTypes.oneOf(Object.values(Blockchain)).isRequired,
  reserve: ReserveAmounts,
  signers: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)])
});

const Destination = PropTypes.shape({
  destinationTag: PropTypes.string,
  fee: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired
});

const Transaction = PropTypes.shape({
  amount: PropTypes.string,
  destinationTag: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  from: PropTypes.string.isRequired,
  hash: PropTypes.string.isRequired,
  network: PropTypes.oneOf(Object.values(Blockchain)).isRequired,
  to: PropTypes.string.isRequired,
  token: PropTypes.object
});

const CustomPropTypes = {
  Account,
  Destination,
  Transaction
};

export default CustomPropTypes;
