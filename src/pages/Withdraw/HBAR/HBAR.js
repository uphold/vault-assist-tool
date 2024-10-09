import { Blockchain, createTransaction, multiSignTransaction } from '../../../lib/vault';
import { Confirm } from './Confirm';
import { Root } from './Root';
import { Route } from '../../../components/Route';
import { Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { useEffect, useState } from 'react';
import CustomPropTypes from '../../../lib/propTypes';
import PropTypes from 'prop-types';

export const HBAR = ({ accountData, onConfirmTransaction, pendingTransaction, setIsGuarded }) => {
  const history = useHistory();
  const { path } = useRouteMatch();
  const [destinationData, setDestinationData] = useState({});

  useEffect(() => {
    if (pendingTransaction) {
      setIsGuarded(true);
    }
  }, [pendingTransaction]);

  const blockchain = Blockchain.HEDERA;

  const onConfirmWithdraw = async ({ backupKey, vaultKey }) => {
    const transaction = await createTransaction(blockchain, {
      ...destinationData,
      from: accountData.address
    });

    const signedTransaction = multiSignTransaction(blockchain, transaction, [vaultKey, backupKey]);

    onConfirmTransaction({ destinationData, network: blockchain, transaction: signedTransaction });
  };

  const onConfirmDestination = destinationData => {
    setDestinationData(destinationData);
    history.push({ ...history.location, pathname: `${path}/confirm` });
  };

  return !pendingTransaction ? (
    <Switch>
      <Route
        accountData={accountData}
        component={Root}
        exact
        key="destination"
        onConfirmDestination={onConfirmDestination}
        path={path}
      />

      <Route
        accountData={accountData}
        component={Confirm}
        exact
        key="confirm"
        onConfirmWithdraw={onConfirmWithdraw}
        path={`${path}/confirm`}
      />
    </Switch>
  ) : null;
};

HBAR.defaultProps = {
  pendingTransaction: false
};

HBAR.propTypes = {
  accountData: CustomPropTypes.Account.isRequired,
  onConfirmTransaction: PropTypes.func.isRequired,
  pendingTransaction: PropTypes.bool,
  setIsGuarded: PropTypes.func.isRequired
};
