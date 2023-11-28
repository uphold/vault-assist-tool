import 'react-toastify/dist/ReactToastify.css';
import { ActionToast } from './ActionToast';
import { ToastContainer as BaseToastContainer, toast } from 'react-toastify';
import { Toast } from './Toast';
import { styles } from '../../lib/styles';
import styled from 'styled-components';

export const ToasterContainer = styled(BaseToastContainer).attrs({
  autoClose: 3000,
  hideProgressBar: true,
  newestOnTop: true
})`
  width: 408px;

  @media (max-width: 480px) {
    width: 100vw;
  }

  .Toastify__close-button {
    color: ${styles.colors.n045};
    display: none;
    opacity: 1;
  }

  &:not(:hover) {
    .Toastify__close-button {
      opacity: 0;
    }
  }

  .Toastify__toast {
    background: none;
    border-radius: 8px;
    min-height: initial;
    padding: 0;
  }

  .Toastify__toast-body {
    padding: 0;
  }
`;

export class Toaster {
  static show({ message, type = 'info', id = '', ...props }) {
    return toast(<Toast message={message} type={type} />, { toastId: id, ...props });
  }

  static showActionToast(props) {
    return toast(<ActionToast {...props} />, {
      autoClose: false,
      closeButton: false,
      closeOnClick: false,
      position: 'bottom-right',
      toastId: props.id
    });
  }

  static showAlert(message, id) {
    return Toaster.show({ id, message, type: 'alert' });
  }

  static showError(message, id) {
    return Toaster.show({ id, message, type: 'error' });
  }

  static showInfo(message, id) {
    return Toaster.show({ id, message, type: 'info' });
  }

  static showSuccess(message, id) {
    return Toaster.show({ id, message, type: 'success' });
  }
}
