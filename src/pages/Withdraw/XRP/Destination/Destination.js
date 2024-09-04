import { Alert } from '../../../../components/Alert';
import { Button } from '../../../../components/Button';
import { Content, Navigation } from '../../../../layouts';
import { DEFAULT_MULTISIG_SIGNERS_REQUIRED, getCurrency } from '../../../../lib/vault';
import { Fragment } from 'react';
import { HorizontalSeparator } from '../../../../components/HorizontalSeparator';
import { NavigationAction } from '../../../../components/Navigation';
import { ScrollableSection } from '../../../../components/ScrollableSection';
import { SectionStickyFooter } from '../../../../components/SectionStickyFooter';
import { TableBox } from '../../../../components/TableView/TableBox';
import { TableViewBody } from '../../../../components/TableView/TableViewBody';
import { TableViewNote } from '../../../../components/TableView/TableViewNote';
import { TableViewTitle } from '../../../../components/TableView/TableViewTitle';
import { TextField } from '../../../../forms/fields/TextField';
import { destinationSchema } from '../../../../forms/schemas';
import { formatNumber } from '../../../../utils/formatNumber';
import { toastErrors } from '../../../../utils/toastErrors';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { useTranslation } from '../../../../hooks/useTranslation';
import { yupResolver } from '@hookform/resolvers/yup';
import BigNumber from 'bignumber.js';
import CustomPropTypes from '../../../../lib/propTypes';
import PropTypes from 'prop-types';

export const Destination = ({ accountData, onConfirmDestination }) => {
  const { t } = useTranslation();
  const history = useHistory();

  const onClickBack = () => {
    history.goBack();
  };

  const { balance, fee: baseFee, reserve, token, trustlines, address: sourceAddress, network } = accountData;
  const { ownerReserve = '0', totalReserve = '0' } = reserve;

  const totalReserveAmount = new BigNumber(totalReserve);
  const remainingBalance = new BigNumber(balance).minus(totalReserveAmount);
  const destinationAmount = new BigNumber(remainingBalance).plus(totalReserveAmount);

  // Fee calculations
  const signerMultiplier = new BigNumber(DEFAULT_MULTISIG_SIGNERS_REQUIRED).plus(1);
  const transactionFee = new BigNumber(baseFee).times(signerMultiplier);
  const fee = trustlines.length > 0 ? transactionFee.toString() : ownerReserve;
  const transactionsRequired = token ? 2 : 1;
  const totalFees = transactionFee.times(transactionsRequired).toString();

  // Send max tokens when not closing vault
  const tokenAmount = token
    ? {
        currency: token.currency,
        issuer: token.account,
        value: token.balance
      }
    : remainingBalance.minus(totalFees).toString();

  const form = useForm({
    mode: 'onChange',
    resolver: yupResolver(destinationSchema(sourceAddress, network))
  });

  const { control, handleSubmit, setError } = form;

  const onSubmit = handleSubmit(async data => {
    const { address, destinationTag } = data;

    try {
      await onConfirmDestination({
        destinationTag: destinationTag.length ? destinationTag : undefined,
        fee,
        from: sourceAddress,
        to: address,
        tokenAmount
      });
    } catch (error) {
      setError('address', [error]);
      toastErrors([error]);
    }
  }, toastErrors);

  return (
    <Fragment>
      <Navigation
        leftAction={<NavigationAction name="back" onClick={onClickBack} />}
        title={t('withdraw.xrp.navigation.title', {
          currency: getCurrency(token?.currency ? token.currency : network)
        })}
      />

      <ScrollableSection>
        <Content paddingBottom="0" paddingTop="0">
          <Alert marginBottom="18px" variant="warning">
            {t('withdraw.xrp.destination.warning', {
              currency: token?.currency ? getCurrency(token.currency) : 'XRPL'
            })}
          </Alert>

          <TextField
            control={control}
            data-test="address"
            label={t('withdraw.xrp.destination.fields.address.label', {
              currency: getCurrency(token?.currency ? token.currency : network)
            })}
            name="address"
            placeholder={t('withdraw.xrp.destination.fields.address.placeholder')}
          />

          <TextField
            control={control}
            data-test="destinationTag"
            label={t('withdraw.xrp.destination.fields.destination.tag.label')}
            name="destinationTag"
            placeholder={t('withdraw.xrp.destination.fields.destination.tag.placeholder')}
          />

          {token?.currency && token?.balance ? (
            <TableBox padding="sp01 sp03">
              <TableViewTitle>{t('withdraw.xrp.destination.label.withdraw.amount')}</TableViewTitle>

              <TableViewBody>
                <TableViewNote>{`${formatNumber(token.balance)} ${getCurrency(token.currency)}`}</TableViewNote>
              </TableViewBody>

              <HorizontalSeparator margin="sp02 0" />

              <TableViewTitle>{t('withdraw.xrp.destination.label.network.costs')}</TableViewTitle>

              <TableViewBody>
                <TableViewNote>{`${formatNumber(totalFees)} XRP`}</TableViewNote>
              </TableViewBody>

              <HorizontalSeparator margin="sp02 0" />

              <TableViewTitle>{t('withdraw.xrp.destination.label.reserve.credit')}</TableViewTitle>

              <TableViewBody>
                <TableViewNote>{`${formatNumber(ownerReserve)} XRP`}</TableViewNote>
              </TableViewBody>
            </TableBox>
          ) : (
            <TableBox padding="sp01 sp03">
              <TableViewTitle>{t('withdraw.xrp.destination.label.withdraw.amount')}</TableViewTitle>

              <TableViewBody>
                <TableViewNote>{`${formatNumber(
                  trustlines.length > 0 ? remainingBalance.toString() : destinationAmount.toString()
                )} XRP`}</TableViewNote>
              </TableViewBody>

              <HorizontalSeparator margin="sp02 0" />

              <TableViewTitle>{t('withdraw.xrp.destination.label.network.costs')}</TableViewTitle>

              <TableViewBody>
                <TableViewNote>{`${formatNumber(trustlines.length > 0 ? totalFees : ownerReserve)} XRP`}</TableViewNote>
              </TableViewBody>
            </TableBox>
          )}
        </Content>

        <SectionStickyFooter>
          <Button onPress={onSubmit}>{t('actions.submit')}</Button>
        </SectionStickyFooter>
      </ScrollableSection>
    </Fragment>
  );
};

Destination.defaultProps = {
  accountData: {
    reserve: {
      baseReserve: 0,
      ownerReserve: 0,
      totalReserve: 0
    }
  }
};

Destination.propTypes = {
  accountData: CustomPropTypes.Account.isRequired,
  onConfirmDestination: PropTypes.func.isRequired
};
