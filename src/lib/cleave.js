import Cleave from 'cleave.js';

export const getNumeralFormatter = options =>
  //  Reference: https://github.com/nosir/cleave.js/blob/master/src/shortcuts/NumeralFormatter.js
  new Cleave.NumeralFormatter(
    options.numeralDecimalMark,
    options.numeralIntegerScale,
    options.numeralDecimalScale,
    options.numeralThousandsGroupStyle,
    options.numeralPositiveOnly,
    options.stripLeadingZeroes,
    options.prefix,
    options.signBeforePrefix,
    options.tailPrefix,
    options.delimiter || ','
  );
