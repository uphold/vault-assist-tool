import { yup } from '../index';

export const addressSchema = yup.object().shape({
  address: yup.string().required().max(25),
});
