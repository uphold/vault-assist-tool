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
import { signingKeysSchema } from '../../../../forms/schemas/signingKeysSchema';
import { toastErrors } from '../../../../utils/toastErrors';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { useTranslation } from '../../../../hooks/useTranslation';
import { yupResolver } from '@hookform/resolvers/yup';
import CustomPropTypes from '../../../../lib/propTypes';
import PropTypes from 'prop-types';

export const Confirm = ({ onConfirmWithdraw, accountData }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  const [isVaultKeySheetVisible, setIsVaultKeySheetVisible] = useState(false);
  const [isBackupKeySheetVisible, setIsBackupKeySheetVisible] = useState(false);
  const { network, signers } = accountData;
  const onClickBack = () => {
    history.goBack();
  };

  const form = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    resolver: yupResolver(signingKeysSchema(network, signers))
  });

  const { control, handleSubmit, setError } = form;

  const onSubmit = handleSubmit(async data => {
    const { vaultKey, backupKey } = data;

    if (vaultKey === backupKey) {
      toastErrors([{ message: t('withdraw.xrp.confirm.fields.keys.error.invalid') }]);
      setError('vaultKey');
      setError('backupKey');

      return;
    }

    setIsLoading(true);
    try {
      await onConfirmWithdraw({ backupKey, vaultKey });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      if (error?.message) {
        toastErrors([error]);
        setError('vaultKey', error.message);
        setError('backupKey', error.message);
      }
    }
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
              onClick: () => setIsVaultKeySheetVisible(true)
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
              onClick: () => setIsBackupKeySheetVisible(true)
            }}
            control={control}
            data-test="backupKey"
            label={t('withdraw.xrp.confirm.fields.backup.key.label')}
            name="backupKey"
            placeholder={t('withdraw.xrp.confirm.fields.vault.key.placeholder')}
          />
        </Content>

        <SectionStickyFooter>
          <Button isLoading={isLoading} onPress={onSubmit}>
            {t('actions.confirm.withdraw')}
          </Button>
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

Confirm.defaultProps = {
  accountData: {
    reserve: {
      baseReserve: 0,
      ownerReserve: 0,
      totalReserve: 0
    }
  }
};

Confirm.propTypes = {
  accountData: CustomPropTypes.Account.isRequired,
  onConfirmWithdraw: PropTypes.func.isRequired
};
