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
  const [selectedNetwork, setSelectedNetwork] = useState(Blockchain.XRPL);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddressInfoSheetVisible, setIsAddressInfoSheetVisible] = useState(false);
  const [isDescriptorInfoSheetVisible, setIsDescriptorInfoSheetVisible] = useState(false);

  const networkNames = Object.freeze({
    [Blockchain.XRPL]: 'XRP',
    [Blockchain.BTC]: 'BTC'
  });

  const networkOptions = [
    { isDisabled: false, label: networkNames[Blockchain.XRPL], value: `${Blockchain.XRPL}` },
    { isDisabled: false, label: networkNames[Blockchain.BTC], value: `${Blockchain.BTC}` }
  ];

  const onClickBack = () => {
    onGoBack();
    history.goBack();
  };

  const form = useForm({
    defaultValues: {
      network: networkOptions[0]
    },
    mode: 'onChange',
    resolver: yupResolver(addressSchema(selectedNetwork))
  });

  const { control, handleSubmit, setError } = form;

  const onSubmit = handleSubmit(async data => {
    const { address, descriptor, network } = data;
    const blockchain = parseInt(network.value, 10);

    setIsLoading(true);
    try {
      await onConfirm({ address, descriptor, network: blockchain });
    } catch (error) {
      setIsLoading(false);
      if (error?.message) {
        if (blockchain === Blockchain.BTC) {
          if (error.message === 'InsufficientFunds') {
            setError('address', error.message);
            toastErrors([
              { message: t('access.fields.address.errors.invalid', { currency: getCurrency(selectedNetwork) }) }
            ]);

            return;
          }
          if (error.message === 'TransactionPending') {
            history.push({ ...history.location, pathname: `/pending` });

            return;
          }
        }
        toastErrors([error]);
        setError('address', error.message);
      }
    }
  }, toastErrors);

  const dismissBottomsheet = () => {
    setIsAddressInfoSheetVisible(false);
    setIsDescriptorInfoSheetVisible(false);
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
            onChange={item => setSelectedNetwork(parseInt(item.value, 10))}
            options={networkOptions}
            placeholder={networkNames[selectedNetwork]}
          />

          <TextField
            action={{
              icon: <Icon marginRight="14px" name="infoCircle" size={24} />,
              onClick: () => setIsAddressInfoSheetVisible(true)
            }}
            control={control}
            data-test="address"
            label={t('access.fields.address.label', { currency: getCurrency(selectedNetwork) })}
            name="address"
            placeholder={t('access.fields.address.placeholder')}
          />

          {selectedNetwork === Blockchain.BTC && (
            <TextField
              action={{
                icon: <Icon marginRight="14px" name="infoCircle" size={24} />,
                onClick: () => setIsDescriptorInfoSheetVisible(true)
              }}
              control={control}
              data-test="descriptor"
              label={t('access.fields.descriptor.label')}
              name="descriptor"
              placeholder={t('access.fields.descriptor.placeholder')}
            />
          )}
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

      <BottomSheet isVisible={isDescriptorInfoSheetVisible} onRequestClose={dismissBottomsheet}>
        <NavigationBar
          leftAction={<NavigationAction name="expand" onClick={dismissBottomsheet} />}
          title={t('access.fields.descriptor.details.header', { currency: getCurrency(selectedNetwork) })}
        />

        <ScrollableSection padding="sp02 sp05">
          <Small marginBottom="sp03">{t('access.fields.descriptor.details.description1')}</Small>

          <Small marginBottom="sp06">{t('access.fields.descriptor.details.description2')}</Small>

          <Button onPress={dismissBottomsheet}>{t('actions.okay')}</Button>
        </ScrollableSection>
      </BottomSheet>
    </Fragment>
  );
};

Root.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onGoBack: PropTypes.func.isRequired
};
