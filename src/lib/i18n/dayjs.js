import 'dayjs/locale/en';
import 'dayjs/locale/es';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import businessDays from 'dayjs-business-days';
import calendar from 'dayjs/plugin/calendar';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import fromNowFormatted from './fromNowFormatted';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import localeData from 'dayjs/plugin/localeData';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import minMax from 'dayjs/plugin/minMax';
import objectSupport from 'dayjs/plugin/objectSupport';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

export const FORMATS = Object.freeze({
  DATE: 'll'
});

dayjs.extend(advancedFormat);
dayjs.extend(businessDays);
dayjs.extend(calendar);
dayjs.extend(customParseFormat);
dayjs.extend(duration);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(localeData);
dayjs.extend(localizedFormat);
dayjs.extend(minMax);
dayjs.extend(objectSupport);
dayjs.extend(relativeTime);
dayjs.extend(timezone);
dayjs.extend(utc);
dayjs.extend(fromNowFormatted);

export default dayjs;
