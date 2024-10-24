/* eslint-disable no-process-env */
import { Access, Landing } from './pages';
import { BTC, HBAR, XRP } from './pages/Withdraw';
import { Blockchain, processTransactionResponses, sendTransaction } from './lib/vault';
import { Failure, Pending, Success, Transaction } from './pages/Transaction';
import { Fragment, useEffect, useState } from 'react';
import { IconDefs } from './components/IconDefs';
import { Route } from './components/Route';
import { Router, Switch } from 'react-router-dom';
import { ToasterContainer } from './components/Toaster';
import { Wrapper } from './layouts/Wrapper';
import { createBrowserHistory } from 'history';
import smoothscroll from 'smoothscroll-polyfill';

const environment = process.env.NODE_ENV || 'development';
const isDevelopment = environment === 'development' || process.env.LOCAL_DEVELOPMENT === 'true';
const history = createBrowserHistory({ basename: isDevelopment ? '/' : '/vault-assist-tool/' });

smoothscroll.polyfill();

const TransactionStatus = Object.freeze({
  failure: 'failure',
  pending: 'pending',
  success: 'success',
  unknown: 'unknown'
});

export const App = () => {
  const [isGuarded, setIsGuarded] = useState(true);
  const [accountData, setAccountData] = useState();
  const [preparedTransaction, setPreparedTransaction] = useState();
  const [preparedTransactions, setPreparedTransactions] = useState();
  const [transactionStatus, setTransactionStatus] = useState(TransactionStatus.unknown);
  const [transactionData, setTransactionData] = useState();

  useEffect(() => {
    if (isGuarded) {
      history.replace('/');
      setTransactionStatus(TransactionStatus.unknown);
    }
  }, [isGuarded]);

  // Transaction guards
  useEffect(() => {
    if (!isGuarded) {
      switch (transactionStatus) {
        case TransactionStatus.success:
          history.replace('/transaction/success');
          break;
        case TransactionStatus.failure:
          history.replace('/transaction/failure');
          break;
        default:
          break;
      }
    }
  }, [isGuarded, transactionStatus]);

  const cleanSession = () => {
    setIsGuarded(true);
    setAccountData();
    setPreparedTransaction();
    setPreparedTransactions();
    setTransactionData();
    setTransactionStatus(TransactionStatus.unknown);
  };

  const onAccessVault = () => {
    cleanSession();
    setIsGuarded(false);
    history.push({ ...history.location, pathname: '/access' });
  };

  const onConfirmAccount = accountData => {
    const { network, token, trustlines } = accountData;

    setAccountData(accountData);
    switch (network) {
      case Blockchain.XRPL:
        if (token) {
          history.push({ ...history.location, pathname: `/withdraw/xrp/destination` });
        } else if (trustlines.length > 0) {
          history.push({ ...history.location, pathname: `/withdraw/xrp/notice` });
        } else {
          history.push({ ...history.location, pathname: `/withdraw/xrp` });
        }
        break;
      case Blockchain.BTC:
        history.push({ ...history.location, pathname: `/withdraw/btc` });
        break;
      case Blockchain.HEDERA:
        history.push({ ...history.location, pathname: `/withdraw/hbar` });
        break;
      default:
        break;
    }
  };

  const onConfirmBatchTransaction = preparedTransactions => {
    setPreparedTransactions(preparedTransactions);
    setTransactionStatus(TransactionStatus.pending);
    history.replace('/transaction');
  };

  const onConfirmTransaction = preparedTransaction => {
    setPreparedTransaction(preparedTransaction);
    setTransactionStatus(TransactionStatus.pending);
    history.replace('/transaction');
  };

  const submitBatchTransactions = async preparedTransactions => {
    try {
      const { network, transactions, destinationData } = preparedTransactions;

      const queue = transactions.map(transaction => sendTransaction(network, transaction));

      const responses = await Promise.all(queue);

      const transactionData = processTransactionResponses(network, responses, destinationData);

      setTransactionData(transactionData);
      setTransactionStatus(TransactionStatus.success);
    } catch (error) {
      console.error(error?.message);
      setTransactionStatus(TransactionStatus.failure);
    }
  };

  const submitTransaction = async preparedTransaction => {
    try {
      const { network, transaction, destinationData } = preparedTransaction;
      const transactionData = await sendTransaction(network, transaction, destinationData);

      setTransactionData(transactionData);
      setTransactionStatus(TransactionStatus.success);
    } catch (error) {
      console.error(error?.message);
      setTransactionStatus(TransactionStatus.failure);
    }
  };

  return (
    <Wrapper>
      <Router history={history}>
        <IconDefs />

        <Switch>
          {!isGuarded ? (
            <Fragment>
              <Route
                component={Access}
                key="access"
                onConfirmAccount={onConfirmAccount}
                onGoBack={() => setIsGuarded(true)}
                path="/access"
              />

              <Route
                accountData={accountData}
                component={XRP}
                key="xrp"
                onConfirmBatchTransaction={onConfirmBatchTransaction}
                onConfirmTransaction={onConfirmTransaction}
                path="/withdraw/xrp"
                pendingTransaction={transactionStatus !== TransactionStatus.unknown}
                setIsGuarded={setIsGuarded}
              />

              <Route
                accountData={accountData}
                component={BTC}
                key="btc"
                onConfirmTransaction={onConfirmTransaction}
                path="/withdraw/btc"
                pendingTransaction={transactionStatus !== TransactionStatus.unknown}
                setIsGuarded={setIsGuarded}
              />

              <Route
                accountData={accountData}
                component={HBAR}
                key="hbar"
                onConfirmTransaction={onConfirmTransaction}
                path="/withdraw/hbar"
                pendingTransaction={transactionStatus !== TransactionStatus.unknown}
                setIsGuarded={setIsGuarded}
              />

              {!transactionData ? (
                <Route
                  component={Transaction}
                  isGuarded={isGuarded}
                  key="transaction"
                  path="/transaction"
                  submitTransaction={async () => {
                    if (!isGuarded) {
                      if (preparedTransactions) {
                        await submitBatchTransactions(preparedTransactions);
                      } else {
                        await submitTransaction(preparedTransaction);
                      }
                    }
                  }}
                />
              ) : null}

              {transactionData ? (
                <Route
                  component={Success}
                  key="success"
                  onFinish={cleanSession}
                  path="/transaction/success"
                  transactionData={transactionData}
                />
              ) : null}

              <Route
                component={Failure}
                key="failure"
                onFinish={cleanSession}
                path="/transaction/failure"
                preparedTransaction={preparedTransaction}
                preparedTransactions={preparedTransactions}
              />

              <Route component={Pending} key="pending" onFinish={cleanSession} path="/pending" />
            </Fragment>
          ) : null}

          <Route component={Landing} onConfirm={onAccessVault} path="/" />
        </Switch>
      </Router>

      <ToasterContainer />

      <div id="dynamicFormPortal" />
    </Wrapper>
  );
};

export default App;
