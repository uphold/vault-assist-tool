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

export const Destination = ({ accountData, onConfirmDestination }) => {
  const { t } = useTranslation();
  const history = useHistory();

  const onClickBack = () => {
    history.goBack();
  };

  const { balance, reserve, address: sourceAddress } = accountData;
  const { ownerReserve = 0, totalReserve = 0 } = reserve;

  const remainingBalance = Number(balance) - Number(totalReserve);
  const destinationAmount = remainingBalance + totalReserve;

  const form = useForm({
    mode: 'onChange',
    resolver: yupResolver(destinationSchema(sourceAddress))
  });

  const { control, handleSubmit } = form;

  const onSubmit = handleSubmit(data => {
    const { address, destinationTag } = data;

    onConfirmDestination({
      destinationTag: destinationTag.length ? destinationTag : undefined,
      fee: ownerReserve,
      to: address
    });
  }, toastErrors);

  return (
    <Fragment>
      <Navigation
        leftAction={<NavigationAction name="back" onClick={onClickBack} />}
        title={t('withdraw.xrp.navigation.title')}
      />

      <ScrollableSection>
        <Content paddingBottom="0" paddingTop="0">
          <Alert marginBottom="18px" variant="warning">
            {t('withdraw.xrp.destination.warning')}
          </Alert>

          <TextField
            control={control}
            data-test="address"
            label={t('withdraw.xrp.destination.fields.address.label')}
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

          <TableBox padding="sp01 sp03">
            <TableViewTitle>{t('withdraw.xrp.destination.label.withdraw.amount')}</TableViewTitle>

            <TableViewBody>
              <TableViewNote>{`${formatNumber(destinationAmount)} XRP`}</TableViewNote>
            </TableViewBody>

            <HorizontalSeparator margin="sp02 0" />

            <TableViewTitle>{t('withdraw.xrp.destination.label.network.costs')}</TableViewTitle>

            <TableViewBody>
              <TableViewNote>{`${formatNumber(ownerReserve)} XRP`}</TableViewNote>
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
