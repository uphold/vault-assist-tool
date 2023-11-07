import * as yup from 'yup';
import { isEmpty } from 'lodash';

yup.addMethod(yup.object, 'isNotEmpty', function (message) {
  return this.test('isNotEmpty', message, (value) => !isEmpty(value));
});

yup.addMethod(yup.string, 'isNotEmpty', function (message) {
  return this.test('isNotEmpty', message, (value) => value && value.trim().length > 0);
});
