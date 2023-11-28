import { Access, Landing } from './pages';
import { Failure, Success, Transaction } from './pages/Transaction';
import { Fragment, useEffect, useState } from 'react';
import { IconDefs } from './components/IconDefs';
import { Route } from './components/Route';
import { Router, Switch } from 'react-router-dom';
import { ToasterContainer } from './components/Toaster';
import { Wrapper } from './layouts/Wrapper';
import { XRP } from './pages/Withdraw';
import { createBrowserHistory } from 'history';
import { sendTransaction } from './lib/vault';
import smoothscroll from 'smoothscroll-polyfill';

const history = createBrowserHistory();

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
    setTransactionData();
    setTransactionStatus(TransactionStatus.unknown);
  };

  const onAccessVault = () => {
    cleanSession();
    setIsGuarded(false);
    history.push({ ...history.location, pathname: '/access' });
  };

  const onConfirmAccount = accountData => {
    setAccountData(accountData);
    history.push({ ...history.location, pathname: `/withdraw/xrp` });
  };

  const onConfirmTransaction = preparedTransaction => {
    setPreparedTransaction(preparedTransaction);
    setTransactionStatus(TransactionStatus.pending);
    history.replace('/transaction');
  };

  const submitTransaction = async preparedTransaction => {
    try {
      const { network, transaction } = preparedTransaction;
      const transactionData = await sendTransaction(network, transaction);

      setTransactionData(transactionData);
      setTransactionStatus(TransactionStatus.success);
    } catch (error) {
      console.error(error);
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
                onConfirmTransaction={onConfirmTransaction}
                path="/withdraw/xrp"
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
                      await submitTransaction(preparedTransaction);
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

              <Route component={Failure} key="failure" onFinish={cleanSession} path="/transaction/failure" />
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
