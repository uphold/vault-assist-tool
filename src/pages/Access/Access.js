import { Blockchain } from 'vault-wallet-toolkit';
import { Details } from './Details';
import { Root } from './Root';
import { Route } from '../../components/Route';
import { Switch, useHistory, useRouteMatch } from 'react-router-dom';
import {
  getBalance,
  getCurrency,
  getFee,
  getReserves,
  getSigners,
  getTokenFromTrustline,
  getTrustlines
} from '../../lib/vault';

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

  const onConfirmAccess = async ({ address, descriptor, network, token: selectedToken }) => {
    const balance = await getBalance(network, address);
    const signers = await getSigners(network, address, descriptor);
    const trustlines = await getTrustlines(network, address);
    const reserve = await getReserves(network, address);
    const fee = await getFee(network, address);
    const token = await getTokenFromTrustline(trustlines, selectedToken);

    if (!signers) {
      throw new Error(t('access.fields.address.errors.invalid', { currency: getCurrency(network) }));
    }

    // If no trust line matching the token, throw error
    if (network === Blockchain.XRPL && selectedToken && !token) {
      throw new Error(t('access.fields.address.errors.invalid', { currency: selectedToken.name }));
    }

    setAccountData({ address, balance, descriptor, fee, network, reserve, signers, token, trustlines });
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
