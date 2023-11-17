import { Blockchain, createTransaction, multiSignTransaction } from '../../../lib/vault';
import { Confirm } from './Confirm';
import { Destination } from './Destination';
import { Root } from './Root';
import { Route } from '../../../components/Route';
import { Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { useEffect, useState } from 'react';
import CustomPropTypes from '../../../lib/propTypes';
import PropTypes from 'prop-types';

export const XRP = ({ accountData, onConfirmTransaction, pendingTransaction, setIsGuarded }) => {
  const history = useHistory();
  const { path } = useRouteMatch();
  const [destinationData, setDestinationData] = useState({});

  useEffect(() => {
    if (pendingTransaction) {
      setIsGuarded(true);
    }
  }, [pendingTransaction]);

  const blockchain = Blockchain.XRPL;
  const onContinueWithdraw = () => {
    history.push({ ...history.location, pathname: `${path}/destination` });
  };

  const onConfirmWithdraw = async ({ backupKey, vaultKey }) => {
    const transaction = await createTransaction(blockchain, {
      ...destinationData,
      from: accountData.address,
      transactionType: 'AccountDelete',
    });

    const signedTransaction = multiSignTransaction(blockchain, transaction, [vaultKey, backupKey]);

    onConfirmTransaction({ network: blockchain, transaction: signedTransaction });
  };

  const onConfirmDestination = (destinationData) => {
    setDestinationData(destinationData);
    history.push({ ...history.location, pathname: `${path}/confirm` });
  };

  return !pendingTransaction ? (
    <Switch>
      <Route
        accountData={accountData}
        component={Root}
        exact
        key="conditions"
        onContinueWithdraw={onContinueWithdraw}
        path={path}
      />
      <Route
        accountData={accountData}
        component={Destination}
        exact
        key="destination"
        onConfirmDestination={onConfirmDestination}
        path={`${path}/destination`}
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

XRP.defaultProps = {
  pendingTransaction: false,
};

XRP.propTypes = {
  accountData: CustomPropTypes.Account.isRequired,
  onConfirmTransaction: PropTypes.func.isRequired,
  pendingTransaction: PropTypes.bool,
  setIsGuarded: PropTypes.func.isRequired,
};
