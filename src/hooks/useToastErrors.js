import { Toaster } from '../components/Toaster';

export const toastErrors = errors => {
  if (errors) {
    Object.entries(errors).forEach(([, error]) => {
      Toaster.showError(error.message);
    });
  }
};
