import { Children, useEffect } from 'react';
import { Toaster } from '../components/Toaster';
import isEmpty from 'lodash/isEmpty';

export const useFormErrorAsToast = props => {
  const { children, error } = props;

  console.log(props);
  useEffect(() => {
    if (isEmpty(error)) {
      return;
    }

    const childrenArr = Children.toArray(children);

    const child =
      childrenArr.find(child => [error.code, error.type].includes(child.props.type)) ||
      childrenArr.find(child => typeof child.props.type === 'undefined');

    if (!child) {
      return;
    }

    Toaster.showError(child.props.children, 'dynamicFormError');
  }, [error]);
};
