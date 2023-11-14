import { Blockchain, validateVaultKeys } from '../../../lib/vault';
import { Confirm } from './Confirm';
import { Destination } from './Destination';
import { Root } from './Root';
import { Route } from '../../../components/Route';
import { Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from '../../../hooks/useTranslation';
import CustomPropTypes from '../../../lib/propTypes';
import PropTypes from 'prop-types';

export const XRP = ({ accountData, onFailure, onSuccess }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { path } = useRouteMatch();
  const [destinationData, setDestinationData] = useState({});

  const { signerList } = accountData;

  const onContinueWithdraw = () => {
    history.push({ ...history.location, pathname: `${path}/destination` });
  };

  const onConfirmWithdraw = ({ vaultKey, backupKey }) => {
    // Validate keys before we send transaction
    if (!validateVaultKeys(Blockchain.XRPL, vaultKey, backupKey, signerList)) {
      throw new Error(t('withdraw.xrp.confirm.fields.keys.error.invalid'));
    }

    // TODO: Transaction submission
    onSuccess(destinationData);
    onFailure();
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
      <Route component={Confirm} exact key="confirm" onConfirmWithdraw={onConfirmWithdraw} path={`${path}/confirm`} />
    </Switch>
  );
};

XRP.propTypes = {
  accountData: CustomPropTypes.Account.isRequired,
  onFailure: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};
