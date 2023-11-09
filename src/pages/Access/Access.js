import { BottomSheet } from '../../components/BottomSheet';
import { Button } from '../../components/Button';
import { Content, Navigation } from '../../layouts';
import { DynamicSelectField } from '../../forms/fields/DynamicSelectField';
import { Fragment, useState } from 'react';
import { Icon } from '../../components/Icon';
import { Mixed } from '../../components/Mixed';
import { NavigationAction, NavigationBar } from '../../components/Navigation';
import { ScrollableSection } from '../../components/ScrollableSection';
import { SectionStickyFooter } from '../../components/SectionStickyFooter';
import { Small } from '../../components/Typography/Small';
import { TextField } from '../../forms/fields/TextField';
import { addressSchema } from '../../forms/schemas';
import { toastErrors } from '../../utils/toastErrors';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { yupResolver } from '@hookform/resolvers/yup';
import styled from 'styled-components';

export const Instructions = styled(Mixed.div)`
  margin-bottom: 24px;
  @media (min-height: 600px) {
    @media (min-width: 884px) {
      text-align: center;
    }
  }
`;

export const Access = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [isAddressInfoSheetVisible, setIsAddressInfoSheetVisible] = useState(false);
  const networkOptions = [
    { isDisabled: false, label: 'XRP', value: 'xrp' },
    { isDisabled: true, label: 'BTC (Soon)', value: 'btc' },
  ];

  const onClickBack = () => {
    history.goBack();
  };

  const form = useForm({
    defaultValues: {
      network: networkOptions[0],
    },
    mode: 'onChange',
    resolver: yupResolver(addressSchema),
  });

  const { control, handleSubmit } = form;

  const onSubmit = handleSubmit((data) => {
    const { cryptoAddress } = data;

    console.log(cryptoAddress);

    // onConfirm({
    //   details: {
    //     address,
    //   },
    // });
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
            data-test="cryptoAddress"
            label={t('access.fields.address.label.xrp')}
            name="cryptoAddress"
            placeholder={t('access.fields.address.placeholder')}
          />
        </Content>
        <SectionStickyFooter>
          <Button onPress={onSubmit}>{t('actions.submit')}</Button>
        </SectionStickyFooter>
      </ScrollableSection>
      <BottomSheet isVisible={isAddressInfoSheetVisible} onRequestClose={dismissBottomsheet}>
        <NavigationBar
          leftAction={<NavigationAction name="expand" onClick={dismissBottomsheet} />}
          title={t('access.fields.address.details.header')}
        />
        <ScrollableSection padding="sp02 sp05">
          <Small marginBottom="sp06">{t('access.fields.address.details.description')}</Small>
          <Button onPress={dismissBottomsheet}>{t('actions.okay')}</Button>
        </ScrollableSection>
      </BottomSheet>
    </Fragment>
  );
};
