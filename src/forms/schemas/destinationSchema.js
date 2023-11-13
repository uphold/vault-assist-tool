import { Blockchain } from '../../lib/vault';
import { I18n } from '../../lib/i18n/provider';
import { isValidAddress } from '../validations/isValidAddress';
import { yup } from '../index';

export const destinationSchema = yup.object().shape({
  address: yup
    .string()
    .required(I18n.t('withdraw.xrp.destination.fields.address.errors.required'))
    .test('validation', I18n.t('withdraw.xrp.destination.fields.address.errors.invalid.xrp'), (val) =>
      isValidAddress(Blockchain.XRPL, val)
    ),
  destinationTag: yup
    .string()
    .test(
      'validation',
      I18n.t('withdraw.xrp.destination.fields.destination.tag.errors.invalid'),
      (val) => !val.includes('-') && !val.includes('.') && !isNaN(Number(val))
    ),
});
