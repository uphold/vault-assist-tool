import { Blockchain, getCurrency } from '../../lib/vault';
import { isValidAddress } from '../validations/isValidAddress';
import { isValidDescriptor } from '../validations/isValidDescriptor';
import { translate } from '../../lib/i18n';
import { yup } from '../index';

export const addressSchema = selectedNetwork => {
  switch (selectedNetwork) {
    case Blockchain.XRPL:
      return yup.object().shape({
        address: yup
          .string()
          .required(translate('access.fields.address.errors.required', { currency: getCurrency(selectedNetwork) }))
          .test(
            'validation',
            translate('access.fields.address.errors.invalid', { currency: getCurrency(selectedNetwork) }),
            val => isValidAddress(selectedNetwork, val, 0)
          )
      });
    case Blockchain.BTC:
      return yup.object().shape({
        address: yup
          .string()
          .required(translate('access.fields.address.errors.required', { currency: getCurrency(selectedNetwork) }))
          .test(
            'validation',
            translate('access.fields.address.errors.invalid', { currency: getCurrency(selectedNetwork) }),
            val => isValidAddress(selectedNetwork, val, 0)
          ),
        descriptor: yup
          .string()
          .required(translate('access.fields.descriptor.errors.required'))
          .test('validation', translate('access.fields.descriptor.errors.invalid'), val => isValidDescriptor(val))
      });
    default:
      break;
  }
};
