import { BottomSheet } from '../../../../components/BottomSheet';
import { Button } from '../../../../components/Button';
import { Content, Navigation } from '../../../../layouts';
import { Fragment, useState } from 'react';
import { Icon } from '../../../../components/Icon';
import { Instructions } from '../../../../components/Instructions';
import { NavigationAction, NavigationBar } from '../../../../components/Navigation';
import { ScrollableSection } from '../../../../components/ScrollableSection';
import { SectionStickyFooter } from '../../../../components/SectionStickyFooter';
import { Small } from '../../../../components/Typography/Small';
import { TextField } from '../../../../forms/fields/TextField';
import { toastErrors } from '../../../../utils/toastErrors';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { useTranslation } from '../../../../hooks/useTranslation';
import { yupResolver } from '@hookform/resolvers/yup';
import PropTypes from 'prop-types';

export const Confirm = ({ onConfirmWithdraw }) => {
  const { t } = useTranslation();
  const history = useHistory();

  const [isVaultKeySheetVisible, setIsVaultKeySheetVisible] = useState(false);
  const [isBackupKeySheetVisible, setIsBackupKeySheetVisible] = useState(false);

  const onClickBack = () => {
    history.goBack();
  };

  const form = useForm({
    mode: 'onChange',
    resolver: yupResolver(false),
  });

  const { control, handleSubmit } = form;

  const onSubmit = handleSubmit((data) => {
    const { vaultKey, backupKey } = data;

    onConfirmWithdraw({ backupKey, vaultKey });
  }, toastErrors);

  const dismissBottomsheet = () => {
    setIsVaultKeySheetVisible(false);
    setIsBackupKeySheetVisible(false);
  };

  return (
    <Fragment>
      <Navigation
        leftAction={<NavigationAction name="back" onClick={onClickBack} />}
        title={t('withdraw.xrp.confirm.navigation.title')}
      />
      <ScrollableSection>
        <Content paddingTop="0">
          <Instructions>
            <Small>{t('withdraw.xrp.confirm.description')}</Small>
          </Instructions>
          <TextField
            action={{
              icon: <Icon marginRight="14px" name="infoCircle" size={24} />,
              onClick: () => setIsVaultKeySheetVisible(true),
            }}
            control={control}
            data-test="vaultKey"
            label={t('withdraw.xrp.confirm.fields.vault.key.label')}
            name="vaultKey"
            placeholder={t('withdraw.xrp.confirm.fields.vault.key.placeholder')}
          />
          <TextField
            action={{
              icon: <Icon marginRight="14px" name="infoCircle" size={24} />,
              onClick: () => setIsBackupKeySheetVisible(true),
            }}
            control={control}
            data-test="vaultKey"
            label={t('withdraw.xrp.confirm.fields.backup.key.label')}
            name="backupKey"
            placeholder={t('withdraw.xrp.confirm.fields.vault.key.placeholder')}
          />
        </Content>
        <SectionStickyFooter>
          <Button onPress={onSubmit}>{t('actions.confirm.withdraw')}</Button>
        </SectionStickyFooter>
      </ScrollableSection>
      <BottomSheet isVisible={isVaultKeySheetVisible} onRequestClose={dismissBottomsheet}>
        <NavigationBar
          leftAction={<NavigationAction name="expand" onClick={dismissBottomsheet} />}
          title={t('withdraw.xrp.confirm.fields.vault.key.details.header')}
        />
        <ScrollableSection padding="sp02 sp05">
          <Small marginBottom="sp06">{t('withdraw.xrp.confirm.fields.vault.key.details.description')}</Small>
          <Button onPress={dismissBottomsheet}>{t('actions.okay')}</Button>
        </ScrollableSection>
      </BottomSheet>
      <BottomSheet isVisible={isBackupKeySheetVisible} onRequestClose={dismissBottomsheet}>
        <NavigationBar
          leftAction={<NavigationAction name="expand" onClick={dismissBottomsheet} />}
          title={t('withdraw.xrp.confirm.fields.backup.key.details.header')}
        />
        <ScrollableSection padding="sp02 sp05">
          <Small marginBottom="sp06">{t('withdraw.xrp.confirm.fields.backup.key.details.description')}</Small>
          <Button onPress={dismissBottomsheet}>{t('actions.okay')}</Button>
        </ScrollableSection>
      </BottomSheet>
    </Fragment>
  );
};

Confirm.propTypes = {
  onConfirmWithdraw: PropTypes.func.isRequired,
};
