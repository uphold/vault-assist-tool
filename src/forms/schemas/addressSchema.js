import { I18n } from '../../lib/i18n/provider';
import { isValidAddress } from '../validations/isValidAddress';
import { yup } from '../index';

export const addressSchema = (selectedNetwork) =>
  yup.object().shape({
    address: yup
      .string()
      .required(I18n.t('access.fields.address.errors.required'))
      .test('validation', I18n.t('access.fields.address.errors.invalid.xrp'), (val) =>
        isValidAddress(selectedNetwork, val)
      ),
  });
