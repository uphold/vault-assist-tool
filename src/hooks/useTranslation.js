import { translate } from '../lib/i18n';
import i18next from 'react-i18next';

export const useTranslation = () => {
  return { I18n: i18next, t: translate };
};
