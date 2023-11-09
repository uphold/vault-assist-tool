import { I18n } from '../../lib/i18n/provider';
import { isXRPAddress } from '../validations/isXRPAddress';
import { yup } from '../index';

export const addressSchema = yup.object().shape({
  cryptoAddress: yup
    .string()
    .required(I18n.t('access.fields.address.errors.required'))
    .test('validation', I18n.t('access.fields.address.errors.invalid.xrp'), (val) => isXRPAddress(val)),
});
