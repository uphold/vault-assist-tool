import { Access, Landing, XRP } from './pages';
import { Fragment, useEffect, useState } from 'react';
import { IconDefs } from './components/IconDefs';
import { Route } from './components/Route';
import { Router, Switch } from 'react-router-dom';
import { ToasterContainer } from './components/Toaster';
import { Wrapper } from './layouts/Wrapper';
import { createBrowserHistory } from 'history';
import smoothscroll from 'smoothscroll-polyfill';

const history = createBrowserHistory();

smoothscroll.polyfill();

export const App = () => {
  const [isGuarded, setIsGuarded] = useState(true);
  const [accountData, setAccountData] = useState();

  useEffect(() => {
    if (isGuarded) {
      history.replace('/');
    }
  }, [isGuarded]);

  const onConfirmAccount = (accountData) => {
    setAccountData(accountData);
    history.push({ ...history.location, pathname: `/withdraw/xrp` });
  };

  const onSuccess = (transaction) => {
    console.log(transaction);
  };

  const onFailure = () => {
    console.log('Failure');
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
            </Fragment>
          ) : null}
          <Route component={Landing} onNavigation={() => setIsGuarded(false)} path="/" />
        </Switch>
      </Router>
      <ToasterContainer />
      <div id="dynamicFormPortal" />
    </Wrapper>
  );
};

export default App;
