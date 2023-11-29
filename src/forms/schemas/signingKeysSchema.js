import { isKeySigner } from '../../lib/vault';
import { isValidMnemonic } from '../validations/isValidMnemonic';
import { translate } from '../../lib/i18n';
import { yup } from '../index';

export const signingKeysSchema = (network, signers) =>
  yup.object().shape({
    backupKey: yup
      .string()
      .required(translate('withdraw.xrp.confirm.fields.backup.key.errors.required'))
      .test(
        'validation',
        translate('withdraw.xrp.confirm.fields.backup.key.errors.invalid'),
        val => isValidMnemonic(val) && isKeySigner(network, val, signers)
      ),
    vaultKey: yup
      .string()
      .required(translate('withdraw.xrp.confirm.fields.vault.key.errors.required'))
      .test(
        'validation',
        translate('withdraw.xrp.confirm.fields.vault.key.errors.invalid'),
        val => isValidMnemonic(val) && isKeySigner(network, val, signers)
      )
  });
