import { Alert } from '../../../../components/Alert';
import { Button } from '../../../../components/Button';
import { Content, Navigation } from '../../../../layouts';
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
import CustomPropTypes from '../../../../lib/propTypes';
import PropTypes from 'prop-types';

export const Root = ({ accountData, onConfirmDestination }) => {
  const { t } = useTranslation();
  const history = useHistory();

  const onClickBack = () => {
    history.goBack();
  };

  const { balance, address: sourceAddress, fee, network } = accountData;

  const form = useForm({
    mode: 'onChange',
    resolver: yupResolver(destinationSchema(sourceAddress, network))
  });

  const { control, handleSubmit } = form;

  const onSubmit = handleSubmit(data => {
    const { address } = data;

    onConfirmDestination({
      amount: balance,
      fee,
      to: address
    });
  }, toastErrors);

  return (
    <Fragment>
      <Navigation
        leftAction={<NavigationAction name="back" onClick={onClickBack} />}
        title={t('withdraw.btc.navigation.title')}
      />

      <ScrollableSection>
        <Content paddingBottom="0" paddingTop="0">
          <Alert marginBottom="18px" variant="warning">
            {t('withdraw.btc.destination.warning')}
          </Alert>

          <TextField
            control={control}
            data-test="address"
            label={t('withdraw.btc.destination.fields.address.label')}
            name="address"
            placeholder={t('withdraw.btc.destination.fields.address.placeholder')}
          />

          <TableBox padding="sp01 sp03">
            <TableViewTitle>{t('withdraw.btc.destination.label.withdraw.amount')}</TableViewTitle>

            <TableViewBody>
              <TableViewNote>{`${formatNumber(balance)} BTC`}</TableViewNote>
            </TableViewBody>

            <HorizontalSeparator margin="sp02 0" />

            <TableViewTitle>{t('withdraw.btc.destination.label.network.costs')}</TableViewTitle>

            <TableViewBody>
              <TableViewNote>{`${formatNumber(fee)} BTC`}</TableViewNote>
            </TableViewBody>
          </TableBox>
        </Content>

        <SectionStickyFooter>
          <Button onPress={onSubmit}>{t('actions.submit')}</Button>
        </SectionStickyFooter>
      </ScrollableSection>
    </Fragment>
  );
};

Root.propTypes = {
  accountData: CustomPropTypes.Account.isRequired,
  onConfirmDestination: PropTypes.func.isRequired
};
