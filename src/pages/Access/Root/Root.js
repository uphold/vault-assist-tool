import { Blockchain, getCurrency, getTokenList } from '../../../lib/vault';
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
  const [selectedAsset, setSelectedAsset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddressInfoSheetVisible, setIsAddressInfoSheetVisible] = useState(false);
  const [isDescriptorInfoSheetVisible, setIsDescriptorInfoSheetVisible] = useState(false);

  const networkNames = Object.freeze({
    [Blockchain.XRPL]: 'XRP',
    [Blockchain.BTC]: 'BTC'
  });

  const assetType = Object.freeze({
    [Blockchain.XRPL]: 'XRPL Token'
  });

  // Build selection options from supported networks
  const supportedNetworkList = [Blockchain.XRPL, Blockchain.BTC];

  const assetOptions = [];

  supportedNetworkList.forEach(blockchain => {
    const tokens = getTokenList(blockchain);

    assetOptions.push({
      data: { blockchain },
      isDisabled: false,
      label: networkNames[blockchain],
      value: assetOptions.length
    });

    if (tokens.length > 0) {
      tokens.forEach(token => {
        assetOptions.push({
          data: { blockchain, token },
          isDisabled: false,
          label: token.name,
          subtitle: assetType[blockchain],
          value: assetOptions.length
        });
      });
    }
  });

  const onClickBack = () => {
    onGoBack();
    history.goBack();
  };

  const form = useForm({
    defaultValues: {
      asset: assetOptions[0]
    },
    mode: 'onChange',
    resolver: yupResolver(addressSchema(assetOptions[selectedAsset].data))
  });

  const { control, handleSubmit, setError } = form;

  const onSubmit = handleSubmit(async data => {
    const { address, descriptor, asset } = data;
    const { blockchain, token } = assetOptions[asset.value].data;

    setIsLoading(true);
    try {
      await onConfirm({ address, descriptor, network: blockchain, token });
    } catch (error) {
      setIsLoading(false);
      if (error?.message) {
        if (blockchain === Blockchain.BTC) {
          if (error.message === 'InsufficientFunds') {
            setError('address', error.message);
            toastErrors([
              { message: t('access.fields.address.errors.invalid', { currency: getCurrency(blockchain) }) }
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
            data-test="asset"
            hideConfirm
            label={t('access.fields.asset.label')}
            name="asset"
            onChange={item => setSelectedAsset(item.value)}
            options={assetOptions}
            placeholder={assetOptions[selectedAsset].label}
          />

          <TextField
            action={{
              icon: <Icon marginRight="14px" name="infoCircle" size={24} />,
              onClick: () => setIsAddressInfoSheetVisible(true)
            }}
            control={control}
            data-test="address"
            label={t('access.fields.address.label', {
              currency: getCurrency(assetOptions[selectedAsset].data.blockchain)
            })}
            name="address"
            placeholder={t('access.fields.address.placeholder')}
          />

          {assetOptions[selectedAsset].data.blockchain === Blockchain.BTC && (
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
          title={t('access.fields.address.details.header', {
            currency: getCurrency(assetOptions[selectedAsset].data.blockchain)
          })}
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
          title={t('access.fields.descriptor.details.header', {
            currency: getCurrency(assetOptions[selectedAsset].data.blockchain)
          })}
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
