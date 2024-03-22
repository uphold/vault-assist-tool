import { Blockchain } from '../../lib/vault';
import { isValidAddress } from '../validations/isValidAddress';
import { translate } from '../../lib/i18n';
import { yup } from '../index';

export const destinationSchema = (sourceAddress, blockchain) => {
  switch (blockchain) {
    case Blockchain.XRPL:
      return yup.object().shape({
        address: yup
          .string()
          .required(translate('withdraw.xrp.destination.fields.address.errors.required'))
          .test(
            'validation',
            translate('withdraw.xrp.destination.fields.address.errors.invalid.xrp'),
            val => isValidAddress(Blockchain.XRPL, val) && val !== sourceAddress
          ),
        destinationTag: yup
          .string()
          .test(
            'validation',
            translate('withdraw.xrp.destination.fields.destination.tag.errors.invalid'),
            val => !val.includes('-') && !val.includes('.') && !isNaN(Number(val))
          )
      });
    case Blockchain.BTC:
      return yup.object().shape({
        address: yup
          .string()
          .required(translate('withdraw.btc.destination.fields.address.errors.required'))
          .test(
            'validation',
            translate('withdraw.btc.destination.fields.address.errors.invalid.btc'),
            val => isValidAddress(Blockchain.BTC, val) && val !== sourceAddress
          )
      });
    default:
      break;
  }
};
