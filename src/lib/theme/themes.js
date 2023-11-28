import { styles } from '../styles';

const { colors } = styles;

const defaultColors = {
  b01: colors.b01,

  'blue-00': colors.blue00,
  'blue-05': colors.blue05,
  'blue-10': colors.blue10,
  'blue-20': colors.blue20,
  'blue-30': colors.blue30,
  'blue-40': colors.blue40,
  'blue-50': colors.blue50,
  'blue-60': colors.blue60,
  'blue-70': colors.blue70,
  'blue-80': colors.blue80,
  'blue-90': colors.blue90,
  'blue-95': colors.blue95,
  'blue-100': colors.blue100,

  e05: colors.e05,
  e06: colors.e06,
  e07: colors.e07,

  g01: colors.g01,

  'green-00': colors.green00,
  'green-05': colors.green05,
  'green-10': colors.green10,
  'green-20': colors.green20,
  'green-30': colors.green30,
  'green-40': colors.green40,
  'green-45': colors.green45,
  'green-50': colors.green50,
  'green-60': colors.green60,
  'green-70': colors.green70,
  'green-80': colors.green80,
  'green-90': colors.green90,
  'green-95': colors.green95,
  'green-100': colors.green100,

  i06: colors.i06,
  i07: colors.i07,

  p06: colors.p06,
  p07: colors.p07,

  'pure-black': colors.pureBlack,
  'pure-white': colors.pureWhite,

  'red-00': colors.red00,
  'red-05': colors.red05,
  'red-10': colors.red10,
  'red-20': colors.red20,
  'red-30': colors.red30,
  'red-40': colors.red40,
  'red-50': colors.red50,
  'red-60': colors.red60,
  'red-70': colors.red70,
  'red-80': colors.red80,
  'red-90': colors.red90,
  'red-95': colors.red95,
  'red-100': colors.red100,

  s06: colors.s06,
  s07: colors.s07,

  w06: colors.w06,
  w07: colors.w07,

  'yellow-00': colors.yellow00,
  'yellow-05': colors.yellow05,
  'yellow-10': colors.yellow10,
  'yellow-20': colors.yellow20,
  'yellow-30': colors.yellow30,
  'yellow-40': colors.yellow40,
  'yellow-50': colors.yellow50,
  'yellow-60': colors.yellow60,
  'yellow-70': colors.yellow70,
  'yellow-80': colors.yellow80,
  'yellow-90': colors.yellow90,
  'yellow-95': colors.yellow95,
  'yellow-100': colors.yellow100
};

export const themes = {
  dark: {
    ...defaultColors,

    n01: colors.nd30,
    n02: colors.nd20,
    n03: colors.nd60,
    n04: colors.nd90,
    n05: colors.nd110,
    n06: colors.nd140,
    n07: colors.n01,
    n025: colors.nd10,
    n045: colors.nd100,
    nd40: colors.nd40,
    nd50: colors.nd50,
    nd70: colors.nd70,
    nd80: colors.nd80,

    'neutral-00': colors.neutral00,
    'neutral-05': colors.neutral05,
    'neutral-10': colors.neutral10,
    'neutral-20': colors.neutral20,
    'neutral-30': colors.neutral30,
    'neutral-40': colors.neutral40,
    'neutral-50': colors.neutral50,
    'neutral-60': colors.neutral60,
    'neutral-70': colors.neutral70,
    'neutral-80': colors.neutral80,
    'neutral-90': colors.neutral90,
    'neutral-95': colors.neutral95,
    'neutral-100': colors.neutral100
  },
  light: {
    ...defaultColors,

    n01: colors.n01,
    n02: colors.n02,
    n03: colors.n03,
    n04: colors.n04,
    n05: colors.n05,
    n06: colors.n06,
    n07: colors.n07,
    n025: colors.n025,
    n045: colors.n045,

    'neutral-00': colors.neutral00,
    'neutral-05': colors.neutral05,
    'neutral-10': colors.neutral10,
    'neutral-20': colors.neutral20,
    'neutral-30': colors.neutral30,
    'neutral-40': colors.neutral40,
    'neutral-50': colors.neutral50,
    'neutral-60': colors.neutral60,
    'neutral-70': colors.neutral70,
    'neutral-80': colors.neutral80,
    'neutral-90': colors.neutral90,
    'neutral-95': colors.neutral95,
    'neutral-100': colors.neutral100
  },
  manager: {
    ...defaultColors,

    e08: '#FA8181',
    lr05: '#6EE39F',
    mr05: '#FDD159',

    n01: colors.n01,
    n02: colors.n02,
    n03: colors.n03,
    n04: colors.n04,
    n05: colors.n05,
    n06: colors.n06,
    n07: colors.n07,
    n025: colors.n025,
    n045: colors.n045
  }
};
