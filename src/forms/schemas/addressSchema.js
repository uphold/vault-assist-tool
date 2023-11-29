import { getCurrency } from '../../lib/vault';
import { isValidAddress } from '../validations/isValidAddress';
import { translate } from '../../lib/i18n';
import { yup } from '../index';

export const addressSchema = selectedNetwork =>
  yup.object().shape({
    address: yup
      .string()
      .required(translate('access.fields.address.errors.required', { currency: getCurrency(selectedNetwork) }))
      .test(
        'validation',
        translate('access.fields.address.errors.invalid', { currency: getCurrency(selectedNetwork) }),
        val => isValidAddress(selectedNetwork, val)
      )
  });
