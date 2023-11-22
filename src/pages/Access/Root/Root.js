import { Blockchain, getCurrency } from '../../../lib/vault';
import { BottomSheet } from '../../../components/BottomSheet';
import { Button } from '../../../components/Button';
import { Content, Navigation } from '../../../layouts';
import { DynamicSelectField } from '../../../forms/fields/DynamicSelectField';
import { Fragment, useState } from 'react';
import { Icon } from '../../../components/Icon';
import { Instructions } from '../../../components/Instructions';
import { NavigationAction, NavigationBar } from '../../../components/Navigation';
import { ScrollableSection } from '../../../components/ScrollableSection';
import { SectionStickyFooter } from '../../../components/SectionStickyFooter';
import { Small } from '../../../components/Typography/Small';
import { TextField } from '../../../forms/fields/TextField';
import { UnorderedList } from '../../../components/UnorderedList';
import { addressSchema } from '../../../forms/schemas';
import { toastErrors } from '../../../utils/toastErrors';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { useTranslation } from '../../../hooks/useTranslation';
import { yupResolver } from '@hookform/resolvers/yup';
import PropTypes from 'prop-types';

export const Root = ({ onConfirm, onGoBack }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [isAddressInfoSheetVisible, setIsAddressInfoSheetVisible] = useState(false);

  const selectedNetwork = Blockchain.XRPL;

  const networkNames = Object.freeze({
    [Blockchain.XRPL]: 'XRP',
    [Blockchain.BTC]: 'BTC (coming soon)',
  });

  const networkOptions = [
    { isDisabled: false, label: networkNames[Blockchain.XRPL], value: `${Blockchain.XRPL}` },
    { isDisabled: true, label: networkNames[Blockchain.BTC], value: `${Blockchain.BTC}` },
  ];

  const onClickBack = () => {
    onGoBack();
    history.goBack();
  };

  const form = useForm({
    defaultValues: {
      network: networkOptions[0],
    },
    mode: 'onChange',
    resolver: yupResolver(addressSchema(selectedNetwork)),
  });

  const { control, handleSubmit, setError } = form;

  const onSubmit = handleSubmit(async (data) => {
    const { address } = data;

    setIsLoading(true);
    try {
      await onConfirm({ address, network: selectedNetwork });
    } catch (error) {
      setIsLoading(false);
      if (error?.message) {
        toastErrors([error]);
        setError('address', error.message);
      }
    }
  }, toastErrors);

  const dismissBottomsheet = () => {
    setIsAddressInfoSheetVisible(false);
  };

  return (
    <Fragment>
      <Navigation
        leftAction={<NavigationAction name="back" onClick={onClickBack} />}
        title={t('access.navigation.title')}
      />
      <ScrollableSection>
        <Content paddingTop="0">
          <Instructions>
            <Small>{t('access.description')}</Small>
          </Instructions>
          <DynamicSelectField
            control={control}
            data-test="network"
            hideConfirm
            label={t('access.fields.network.label')}
            name="network"
            options={networkOptions}
            placeholder={t('access.fields.network.placeholder')}
          />
          <TextField
            action={{
              icon: <Icon marginRight="14px" name="infoCircle" size={24} />,
              onClick: () => setIsAddressInfoSheetVisible(true),
            }}
            control={control}
            data-test="address"
            label={t('access.fields.address.label', { currency: getCurrency(selectedNetwork) })}
            name="address"
            placeholder={t('access.fields.address.placeholder')}
          />
        </Content>
        <SectionStickyFooter>
          <Button isLoading={isLoading} onPress={onSubmit}>
            {t('actions.submit')}
          </Button>
        </SectionStickyFooter>
      </ScrollableSection>
      <BottomSheet isVisible={isAddressInfoSheetVisible} onRequestClose={dismissBottomsheet}>
        <NavigationBar
          leftAction={<NavigationAction name="expand" onClick={dismissBottomsheet} />}
          title={t('access.fields.address.details.header', { currency: getCurrency(selectedNetwork) })}
        />
        <ScrollableSection padding="sp02 sp05">
          <Small marginBottom="sp03">{t('access.fields.address.details.description')}</Small>
          <UnorderedList customIcon={false} marginBottom="sp06" marginLeft="sp02">
            <Small>{t('access.fields.address.details.bullet1')}</Small>
            <Small>{t('access.fields.address.details.bullet2')}</Small>
          </UnorderedList>
          <Button onPress={dismissBottomsheet}>{t('actions.okay')}</Button>
        </ScrollableSection>
      </BottomSheet>
    </Fragment>
  );
};

Root.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onGoBack: PropTypes.func.isRequired,
};
