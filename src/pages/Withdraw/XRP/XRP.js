import {
  Blockchain,
  createTransaction,
  getBalance,
  getCurrency,
  getTokenFromTrustline,
  getTrustlines,
  multiSignTransaction,
  transactionTypes
} from '../../../lib/vault';
import { Confirm } from './Confirm';
import { Destination } from './Destination';
import { Notice } from './Notice';
import { Root } from './Root';
import { Route } from '../../../components/Route';
import { Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTranslation } from '../../../hooks/useTranslation';
import CustomPropTypes from '../../../lib/propTypes';
import PropTypes from 'prop-types';

export const XRP = ({
  accountData: initialAccountData,
  onConfirmTransaction,
  onConfirmBatchTransaction,
  pendingTransaction,
  setIsGuarded
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { path } = useRouteMatch();
  const [accountData, setAccountData] = useState(initialAccountData);
  const [destinationData, setDestinationData] = useState({});

  useEffect(() => {
    if (pendingTransaction) {
      setIsGuarded(true);
    }
  }, [pendingTransaction, setIsGuarded]);

  const blockchain = Blockchain.XRPL;
  const onContinueWithdraw = data => {
    setAccountData(data);
    history.push({ ...history.location, pathname: `${path}/destination` });
  };

  const onConfirmWithdraw = async ({ backupKey, vaultKey }) => {
    const { token, trustlines, address } = accountData;
    const { tokenAmount } = destinationData;

    if (token && token.balance !== '0') {
      // Transaciton 1: Withdraw token to a destination
      const paymentTransaction = await createTransaction(blockchain, {
        ...destinationData,
        amount: tokenAmount,
        transactionType: transactionTypes[blockchain].Payment
      });

      const signedPaymentTransaction = multiSignTransaction(blockchain, paymentTransaction, [vaultKey, backupKey]);

      // Transaction 2: Set trust line to zero and refund reserve
      const trustlineTransaction = await createTransaction(blockchain, {
        from: address,
        limitAmount: {
          ...tokenAmount,
          value: '0'
        },
        queued: 1,
        transactionType: transactionTypes[blockchain].TrustSet
      });

      const signedTrustlineTransaction = multiSignTransaction(blockchain, trustlineTransaction, [vaultKey, backupKey]);

      onConfirmBatchTransaction({
        destinationData: {
          ...destinationData,
          transactionType: transactionTypes[blockchain].Payment
        },
        network: blockchain,
        transactions: [signedPaymentTransaction, signedTrustlineTransaction]
      });
    } else if (token && token.balance === '0') {
      // Set trust line to zero and refund reserve
      const trustlineTransaction = await createTransaction(blockchain, {
        from: address,
        limitAmount: {
          ...tokenAmount,
          value: '0'
        },
        transactionType: transactionTypes[blockchain].TrustSet
      });

      const signedTrustlineTransaction = multiSignTransaction(blockchain, trustlineTransaction, [vaultKey, backupKey]);

      onConfirmBatchTransaction({
        destinationData: {
          ...destinationData,
          amount: accountData?.reserve?.ownerReserve ?? '0',
          transactionType: transactionTypes[blockchain].TrustSet
        },
        network: blockchain,
        transactions: [signedTrustlineTransaction]
      });
    } else if (trustlines.length > 0) {
      // Withdraw all XRP to destination
      const transaction = await createTransaction(blockchain, {
        ...destinationData,
        amount: tokenAmount,
        transactionType: transactionTypes[blockchain].Payment
      });

      const signedTransaction = multiSignTransaction(blockchain, transaction, [vaultKey, backupKey]);

      onConfirmTransaction({ network: blockchain, transaction: signedTransaction });
    } else {
      // Withdraw XRP to destination including what is in reserve
      const transaction = await createTransaction(blockchain, {
        ...destinationData,
        transactionType: transactionTypes[blockchain].AccountDelete
      });

      const signedTransaction = multiSignTransaction(blockchain, transaction, [vaultKey, backupKey]);

      onConfirmTransaction({ network: blockchain, transaction: signedTransaction });
    }
  };

  const onConfirmDestination = async destinationData => {
    const { to, tokenAmount } = destinationData;

    if ((await getBalance(blockchain, to)) !== '0') {
      if (typeof tokenAmount === 'string') {
        setDestinationData(destinationData);
        history.push({ ...history.location, pathname: `${path}/confirm` });
      } else {
        const trustlines = await getTrustlines(blockchain, to);

        if (getTokenFromTrustline(trustlines, tokenAmount)) {
          setDestinationData(destinationData);
          history.push({ ...history.location, pathname: `${path}/confirm` });
        } else {
          throw new Error(
            t('withdraw.xrp.destination.fields.address.errors.trustline', {
              currency: getCurrency(tokenAmount.currency)
            })
          );
        }
      }
    } else {
      throw new Error(
        t('withdraw.xrp.destination.fields.address.errors.notactivated', { currency: getCurrency(blockchain) })
      );
    }
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
        component={Notice}
        exact
        key="notice"
        onContinueWithdraw={onContinueWithdraw}
        path={`${path}/notice`}
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
  pendingTransaction: false
};

XRP.propTypes = {
  accountData: CustomPropTypes.Account.isRequired,
  onConfirmBatchTransaction: PropTypes.func.isRequired,
  onConfirmTransaction: PropTypes.func.isRequired,
  pendingTransaction: PropTypes.bool,
  setIsGuarded: PropTypes.func.isRequired
};
