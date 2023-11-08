import { I18n } from '../../lib/i18n/provider';
import { yup } from '../index';

export const addressSchema = yup.object().shape({
  address: yup
    .string()
    .required(I18n.t('access.fields.address.errors.required'))
    .max(25, I18n.t('access.fields.address.errors.invalid')),
});
