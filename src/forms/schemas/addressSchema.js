import { Blockchain, getCurrency } from '../../lib/vault';
import { isValidAddress } from '../validations/isValidAddress';
import { isValidDescriptor } from '../validations/isValidDescriptor';
import { translate } from '../../lib/i18n';
import { yup } from '../index';

export const addressSchema = ({ blockchain }) => {
  switch (blockchain) {
    case Blockchain.XRPL:
      return yup.object().shape({
        address: yup
          .string()
          .required(translate('access.fields.address.errors.required', { currency: getCurrency(blockchain) }))
          .test(
            'validation',
            translate('access.fields.address.errors.invalid', { currency: getCurrency(blockchain) }),
            val => isValidAddress(blockchain, val, 0)
          )
      });
    case Blockchain.BTC:
      return yup.object().shape({
        address: yup
          .string()
          .required(translate('access.fields.address.errors.required', { currency: getCurrency(blockchain) }))
          .test(
            'validation',
            translate('access.fields.address.errors.invalid', { currency: getCurrency(blockchain) }),
            val => isValidAddress(blockchain, val, 0)
          ),
        descriptor: yup
          .string()
          .required(translate('access.fields.descriptor.errors.required'))
          .test('validation', translate('access.fields.descriptor.errors.invalid'), val => isValidDescriptor(val))
      });
    case Blockchain.HEDERA:
      return yup.object().shape({
        address: yup
          .string()
          .required(translate('access.fields.address.errors.required', { currency: getCurrency(blockchain) }))
          .test(
            'validation',
            translate('access.fields.address.errors.invalid', { currency: getCurrency(blockchain) }),
            val => isValidAddress(blockchain, val, 0)
          )
      });
    default:
      break;
  }
};
