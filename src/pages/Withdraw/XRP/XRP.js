import { Blockchain, createTransaction, multiSignTransaction, sendTransaction } from '../../../lib/vault';
import { Confirm } from './Confirm';
import { Destination } from './Destination';
import { Root } from './Root';
import { Route } from '../../../components/Route';
import { Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { useState } from 'react';
import CustomPropTypes from '../../../lib/propTypes';
import PropTypes from 'prop-types';

export const XRP = ({ accountData, onFailure, onSuccess }) => {
  const history = useHistory();
  const { path } = useRouteMatch();
  const [destinationData, setDestinationData] = useState({});

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

    try {
      const transactionData = await sendTransaction(blockchain, signedTransaction);

      onSuccess(transactionData);
    } catch (error) {
      console.error(error);
      onFailure();
    }
  };

  const onConfirmDestination = (destinationData) => {
    setDestinationData(destinationData);
    history.push({ ...history.location, pathname: `${path}/confirm` });
  };

  return (
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
  );
};

XRP.propTypes = {
  accountData: CustomPropTypes.Account.isRequired,
  onFailure: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};
