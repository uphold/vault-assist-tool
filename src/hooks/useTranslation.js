import { I18nextProvider } from 'react-i18next';
import { translate } from '../lib/i18n';

export const useTranslation = () => {
  return { I18n: I18nextProvider, t: translate };
};
