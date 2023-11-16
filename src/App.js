import { Access, Landing } from './pages';
import { Failure, Success } from './pages/Transaction';
import { Fragment, useEffect, useState } from 'react';
import { IconDefs } from './components/IconDefs';
import { Route } from './components/Route';
import { Router, Switch } from 'react-router-dom';
import { ToasterContainer } from './components/Toaster';
import { Wrapper } from './layouts/Wrapper';
import { XRP } from './pages/Withdraw';
import { createBrowserHistory } from 'history';
import smoothscroll from 'smoothscroll-polyfill';

const history = createBrowserHistory();

smoothscroll.polyfill();

export const App = () => {
  const [isGuarded, setIsGuarded] = useState(true);
  const [accountData, setAccountData] = useState();
  const [transactionData, setTransactionData] = useState();

  useEffect(() => {
    if (isGuarded) {
      history.replace('/');
    }
  }, [isGuarded]);

  const onAccessVault = () => {
    setIsGuarded(false);
    history.push({ ...history.location, pathname: '/access' });
  };

  const onConfirmAccount = (accountData) => {
    setAccountData(accountData);
    history.push({ ...history.location, pathname: `/withdraw/xrp` });
  };

  const onSuccess = (transactionData) => {
    setTransactionData(transactionData);
    history.push({ ...history.location, pathname: `/transaction/success` });
  };

  const onFailure = () => {
    history.push({ ...history.location, pathname: `/transaction/failure` });
  };

  const onFinish = () => {
    setIsGuarded(true);
    setAccountData();
    setTransactionData();
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
                onFailure={onFailure}
                onSuccess={onSuccess}
                path="/withdraw/xrp"
              />
              <Route
                component={Success}
                key="success"
                onFinish={onFinish}
                path="/transaction/success"
                transactionData={transactionData}
              />
              <Route component={Failure} key="failure" onFinish={onFinish} path="/transaction/failure" />
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
