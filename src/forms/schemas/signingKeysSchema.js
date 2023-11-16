import { I18n } from '../../lib/i18n/provider';
import { isKeySigner } from '../../lib/vault';
import { isValidMnemonic } from '../validations/isValidMnemonic';
import { yup } from '../index';

export const signingKeysSchema = (network, signers) =>
  yup.object().shape({
    backupKey: yup
      .string()
      .required(I18n.t('withdraw.xrp.confirm.fields.backup.key.errors.required'))
      .test(
        'validation',
        I18n.t('withdraw.xrp.confirm.fields.backup.key.errors.invalid'),
        (val) => isValidMnemonic(val) && isKeySigner(network, val, signers)
      ),
    vaultKey: yup
      .string()
      .required(I18n.t('withdraw.xrp.confirm.fields.vault.key.errors.required'))
      .test(
        'validation',
        I18n.t('withdraw.xrp.confirm.fields.vault.key.errors.invalid'),
        (val) => isValidMnemonic(val) && isKeySigner(network, val, signers)
      ),
  });
