import { I18n } from '../../lib/i18n/provider';
import { isValidMnemonic } from '../validations/isValidMnemonic';
import { yup } from '../index';

export const signingKeysSchema = yup.object().shape({
  backupKey: yup
    .string()
    .required(I18n.t('withdraw.xrp.confirm.fields.backup.key.errors.required'))
    .test('validation', I18n.t('withdraw.xrp.confirm.fields.backup.key.errors.invalid'), (val) => isValidMnemonic(val)),
  vaultKey: yup
    .string()
    .required(I18n.t('withdraw.xrp.confirm.fields.vault.key.errors.required'))
    .test('validation', I18n.t('withdraw.xrp.confirm.fields.vault.key.errors.invalid'), (val) => isValidMnemonic(val)),
});
