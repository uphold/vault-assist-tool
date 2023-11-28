/* eslint-disable id-length */
const extensions = {
  en: {
    d: 'yesterday',
    dd: '%dd',
    h: '%dh',
    hh: '%dh',
    m: '%dm',
    mm: '%dm',
    s: 'just now',
    w: '%dw',
    ww: '%dw',
    yy: '%dy'
  },
  es: {
    d: 'ayer',
    dd: '%dd',
    h: '%dh',
    hh: '%dh',
    localeDate: 'D MMM',
    m: '%dm',
    mm: '%dm',
    s: 'ahora mismo',
    w: '%ds',
    ww: '%ds',
    yy: '%da'
  }
};

const baseThresholds = [
  { d: 'second', ignorePastAndFuture: true, l: 's', r: 59 },
  { l: 'm', r: 1 },
  { d: 'minute', l: 'mm', r: 59 },
  { l: 'h', r: 1 },
  { d: 'hour', l: 'hh', r: 23 },
  { ignorePastAndFuture: true, l: 'd', r: 1 },
  { d: 'day', l: 'dd', r: 6 },
  { l: 'w', r: 1 },
  { d: 'week', l: 'ww', r: 3 }
];

// This is based from dayjs's base relativeTime plugin implementation
// https://github.com/iamkun/dayjs/blob/master/src/plugin/relativeTime/index.js
export default (option, dayjsClass, dayjsFactory) => {
  dayjsClass.prototype.fromNowFormatted = function ({ extension: customExtension, thresholds: customThresholds } = {}) {
    const now = dayjsFactory();
    const { name: localeName, relativeTime } = now.$locale();

    const extension = customExtension || extensions[localeName];
    const thresholds = customThresholds || baseThresholds;

    if (!extension) {
      return this.fromNow();
    }

    const localeData = { ...relativeTime, ...extension };

    let formattedResult;
    let isFuture;
    let result;
    let threshold;

    for (let index = 0; index < thresholds.length; index += 1) {
      threshold = thresholds[index];

      if (threshold.d) {
        result = this.diff(now, threshold.d, true);
      }

      const abs = Math.round(Math.abs(result));

      isFuture = result > 0;

      if (abs <= threshold.r || !threshold.r) {
        // 1 minutes -> a minute, 0 seconds -> 0 second
        if (abs <= 1 && index > 0) {
          threshold = thresholds[index - 1];
        }

        const format = localeData[threshold.l];

        formattedResult = format.replace('%d', abs);

        break;
      }
    }

    if (!formattedResult) {
      const isSameYear = this.year() === now.year();

      return this.format(isSameYear ? localeData.localeDate || 'MMM D' : 'll');
    }

    if (threshold?.ignorePastAndFuture) {
      return formattedResult;
    }

    const pastOrFuture = isFuture ? localeData.future : localeData.past;

    if (typeof pastOrFuture === 'function') {
      return pastOrFuture(formattedResult);
    }

    return pastOrFuture.replace('%s', formattedResult);
  };
};
