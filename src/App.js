import { Access, Landing } from './pages';
import { IconDefs } from './components/IconDefs';
import { Route } from './components/Route';
import { Router, Switch } from 'react-router-dom';
import { Wrapper } from './layouts/Wrapper';
import { createBrowserHistory } from 'history';
import { useEffect, useState } from 'react';
import smoothscroll from 'smoothscroll-polyfill';

const history = createBrowserHistory();

smoothscroll.polyfill();

export const App = () => {
  const [isGuarded, setIsGuarded] = useState(true);

  useEffect(() => {
    if (isGuarded) {
      history.replace('/');
    }
  }, [isGuarded]);

  return (
    <Wrapper>
      <Router history={history}>
        <IconDefs />
        <Switch>
          {!isGuarded ? <Route component={Access} exact key="access" path="/access" /> : null}
          <Route component={Landing} onNavigation={() => setIsGuarded(false)} path="/" />
        </Switch>
      </Router>
    </Wrapper>
  );
};

export default App;
