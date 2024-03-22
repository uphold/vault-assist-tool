import { Details } from './Details';
import { Root } from './Root';
import { Route } from '../../components/Route';
import { Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { getBalance, getCurrency, getFee, getReserves, getSigners } from '../../lib/vault';
import { useEffect, useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import PropTypes from 'prop-types';

export const Access = ({ onConfirmAccount, onGoBack }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { path } = useRouteMatch();
  const [accountData, setAccountData] = useState();

  useEffect(() => {
    if (!accountData) {
      history.replace(path);
    }
  }, [accountData]);

  const onConfirmAccess = async ({ address, descriptor, network }) => {
    const balance = await getBalance(network, address);
    const signers = await getSigners(network, address, descriptor);
    const reserve = await getReserves(network, address);
    const fee = await getFee(network, address);

    if (!signers) {
      throw new Error(t('access.fields.address.errors.invalid', { currency: getCurrency(network) }));
    }

    setAccountData({ address, balance, descriptor, fee, network, reserve, signers });
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
          onConfirm={() => onConfirmAccount(accountData)}
          path={`${path}/details`}
        />
      ) : null}

      <Route component={Root} key="access" onConfirm={onConfirmAccess} onGoBack={onGoBack} path={path} />
    </Switch>
  );
};

Access.propTypes = {
  onConfirmAccount: PropTypes.func.isRequired,
  onGoBack: PropTypes.func.isRequired
};
