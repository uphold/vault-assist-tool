import { Details } from './Details';
import { Root } from './Root';
import { Route } from '../../components/Route';
import { Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export const Access = ({ onConfirmAccount, onGoBack }) => {
  const history = useHistory();
  const { path } = useRouteMatch();
  const [accountData, setAccountData] = useState();

  useEffect(() => {
    if (!accountData) {
      history.replace(path);
    }
  }, [accountData]);

  const onConfirmAccess = (accountData) => {
    setAccountData(accountData);
    history.push({ ...history.location, pathname: `${path}/details` });
  };

  return (
    <Switch>
      {accountData ? (
        <Route
          accountData={accountData}
          component={Details}
          exact
          key="details"
          onConfirmAccount={onConfirmAccount}
          path={`${path}/details`}
        />
      ) : null}
      <Route component={Root} key="access" onConfirmAccess={onConfirmAccess} onGoBack={onGoBack} path={path} />
    </Switch>
  );
};

Access.propTypes = {
  onConfirmAccount: PropTypes.func.isRequired,
  onGoBack: PropTypes.func.isRequired,
};
