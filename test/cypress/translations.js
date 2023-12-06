import * as webLocales from '../../src/assets/locales';
import { setLocales } from '../../src/lib/i18n';
import i18next from 'i18next';

const I18n = i18next;

setLocales(webLocales.en);

export default I18n;
