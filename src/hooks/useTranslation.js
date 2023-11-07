import { I18n } from '../lib/i18n/provider';

export const useTranslation = () => {
  const exists = I18n.exists.bind(I18n);
  const translate = I18n.t.bind(I18n);

  return { exists, t: translate };
};
