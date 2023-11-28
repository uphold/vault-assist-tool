import { styles } from '../styles';
import ThemeBuilder from './ThemeBuilder';

export const ThemePreference = Object.freeze({
  Dark: 'dark',
  Light: 'dark',
  System: 'system'
});

const defaultTypography = {
  color: 'n06',
  fontFamily: 'Metropolis',
  fontWeight: 'light'
};

export const getTheme = themeName =>
  new ThemeBuilder()
    .setTheme(themeName)
    .setElement('alert', {
      borderRadius: '4px',
      padding: '16px'
    })
    .setElement(
      'alert',
      { variant: 'error' },
      { backgroundColor: styles.Utils.getColorWithOpacity(styles.colors.e06, 0.16) }
    )
    .setElement(
      'alert',
      { variant: 'info' },
      { backgroundColor: styles.Utils.getColorWithOpacity(styles.colors.i06, 0.16) }
    )
    .setElement('alert', { variant: 'pending' }, { backgroundColor: 'n02' })
    .setElement(
      'alert',
      { variant: 'success' },
      { backgroundColor: styles.Utils.getColorWithOpacity(styles.colors.p06, 0.16) }
    )
    .setElement(
      'alert',
      { variant: 'warning' },
      { backgroundColor: styles.Utils.getColorWithOpacity(styles.colors.w06, 0.16) }
    )
    .setElement('alertIcon', { variant: 'error' }, { backgroundColor: 'e06', color: 'n01' })
    .setElement('alertIcon', { variant: 'info' }, { backgroundColor: 'i06', color: 'n01' })
    .setElement('alertIcon', { variant: 'pending' }, { backgroundColor: 'w07', color: 'n01' })
    .setElement('alertIcon', { variant: 'success' }, { backgroundColor: 'p06', color: 'n01' })
    .setElement('alertIcon', { variant: 'warning' }, { backgroundColor: 'w06', color: 'n07' })
    .setElement('banner', { backgroundColor: 'n01', borderRadius: '8px', borderWidth: 0 })
    .setElement('banner', { variant: 'info' }, { backgroundColor: 'i06' })
    .setElement('banner', { variant: 'warning' }, { backgroundColor: 'w06' })
    .setElement('bannerDescription', {
      ...defaultTypography,
      color: 'n05',
      fontSize: '14px',
      letterSpacing: '0.4px',
      lineHeight: '20px'
    })
    .setElement(
      'bannerDescription',
      { variant: 'info' },
      { color: styles.Utils.getColorWithOpacity(styles.colors.n01, 0.87) }
    )
    .setElement(
      'bannerDescription',
      { variant: 'warning' },
      { color: styles.Utils.getColorWithOpacity(styles.colors.n06, 0.87) }
    )
    .setElement('bannerTitle', {
      ...defaultTypography,
      fontSize: '16px',
      fontWeight: 'bold',
      letterSpacing: 0,
      lineHeight: '24px'
    })
    .setElement('bannerTitle', { variant: 'info' }, { color: 'n01' })
    .setElement('button', {
      backgroundColor: 'p06',
      borderRadius: '22px',
      borderWidth: 0,
      color: 'n01',
      fontFamily: 'Metropolis',
      fontSize: '16px',
      fontWeight: 'semibold',
      letterSpacing: '0.4px',
      lineHeight: '20px'
    })
    .setElement(
      'button',
      { status: 'disabled' },
      { backgroundColor: styles.Utils.getColorWithOpacity(styles.colors.p06, 0.64) }
    )
    .setElement('button', { status: 'hover' }, { backgroundColor: 'p07' })
    .setElement(
      'button',
      { variant: 'secondary' },
      {
        backgroundColor: styles.Utils.getColorWithOpacity(styles.colors.p06, 0.16),
        color: 'p07'
      }
    )
    .setElement('button', { variant: 'danger' }, { backgroundColor: 'e06', color: 'n01' })
    .setElement(
      'button',
      { status: 'disabled', variant: 'danger' },
      { backgroundColor: styles.Utils.getColorWithOpacity(styles.colors.e06, 0.64) }
    )
    .setElement('button', { status: 'hover', variant: 'danger' }, { backgroundColor: 'e07' })
    .setElement(
      'button',
      { status: 'hover', variant: 'secondary' },
      { backgroundColor: styles.Utils.getColorWithOpacity(styles.colors.p07, 0.16) }
    )
    .setElement('button', { variant: 'highContrast' }, { backgroundColor: 'b01', color: 'n01', fontSize: '16px' })
    .setElement('button', { status: 'hover', variant: 'highContrast' }, { backgroundColor: 'n06' })
    .setElement('button', { status: 'hover', variant: 'link' }, { backgroundColor: 'n01' })
    .setElement(
      'button',
      { variant: 'link' },
      {
        backgroundColor: 'n01',
        color: 'p06'
      }
    )
    .setElement('button', { status: 'hover', variant: 'link' }, { backgroundColor: 'n01' })
    .setElement('caption', { ...defaultTypography, fontSize: '10px', letterSpacing: '1px', lineHeight: '12px' })
    .setElement('chartPill', {
      ...defaultTypography,
      backgroundColor: 'n01',
      borderRadius: '16px',
      borderWidth: 0,
      color: 'n05',
      fontSize: '12px',
      fontWeight: 'semibold',
      letterSpacing: '0.4px',
      lineHeight: '16px',
      textAlign: 'center'
    })
    .setElement('chartPill', { variant: 'disabled' }, { color: 'n04' })
    .setElement(
      'chartPill',
      { status: 'selected' },
      { backgroundColor: styles.Utils.getColorWithOpacity(styles.colors.n045, 0.24) }
    )
    .setElement('chartPill', { status: 'selected', variant: 'disabled' }, { backgroundColor: 'n025' })
    .setElement(
      'chartPill',
      { status: 'selected', variant: 'down' },
      { backgroundColor: styles.Utils.getColorWithOpacity(styles.colors.e06, 0.16), color: 'e06' }
    )
    .setElement(
      'chartPill',
      { status: 'selected', variant: 'up' },
      { backgroundColor: styles.Utils.getColorWithOpacity(styles.colors.p06, 0.16), color: 'p06' }
    )
    .setElement('chartPill', { status: 'hover' }, { backgroundColor: 'n045', color: 'n01' })
    .setElement('chartPill', { status: 'hover', variant: 'down' }, { backgroundColor: 'e06', color: 'n01' })
    .setElement('chartPill', { status: 'hover', variant: 'up' }, { backgroundColor: 'p06', color: 'n01' })
    .setElement('code', {
      ...defaultTypography,
      fontFamily: 'Ocr-A-Std',
      fontSize: '14px',
      letterSpacing: 0,
      lineHeight: '20px'
    })
    .setElement('h1', { ...defaultTypography, fontSize: '32px', letterSpacing: '0.8px', lineHeight: '40px' })
    .setElement('h2', { ...defaultTypography, fontSize: '28px', letterSpacing: '0.8px', lineHeight: '36px' })
    .setElement('h3', { ...defaultTypography, fontSize: '24px', letterSpacing: '0.8px', lineHeight: '32px' })
    .setElement('h4', { ...defaultTypography, fontSize: '20px', letterSpacing: 0, lineHeight: '28px' })
    .setElement('hero', { ...defaultTypography, fontSize: '44px', letterSpacing: '-0.4px', lineHeight: '56px' })
    .setElement('input', {
      borderColor: 'n04',
      borderRadius: '8px',
      borderWidth: '1px',
      color: 'n06',
      fontSize: '24px',
      letterSpacing: '0.8px'
    })
    .setElement('input', { status: 'focus' }, { borderColor: 'n06', borderWidth: '2px' })
    .setElement('label', { backgroundColor: 'n01', color: 'n05' })
    .setElement('label', { status: 'focus' }, { color: 'n06' })
    .setElement('link', {
      ...defaultTypography,
      color: 'p06',
      fontSize: '16px',
      letterSpacing: 0,
      lineHeight: '24px',
      textDecoration: 'none'
    })
    .setElement('mask', {
      ...defaultTypography,
      fontFamily: 'Ocr-A-Std',
      fontSize: '18px',
      letterSpacing: 0.4,
      lineHeight: '24px'
    })
    .setElement('paragraph', { ...defaultTypography, fontSize: '16px', letterSpacing: 0, lineHeight: '24px' })
    .setElement('paragraph', { variant: 'error' }, { color: 'e06' })
    .setElement('pill', {
      ...defaultTypography,
      backgroundColor: 'n02',
      borderRadius: '16px',
      borderWidth: 0,
      color: 'n05',
      fontSize: '12px',
      fontWeight: 'semibold',
      letterSpacing: '0.4px',
      lineHeight: '16px',
      textAlign: 'center'
    })
    .setElement('pill', { status: 'hover' }, { backgroundColor: 'n03' })
    .setElement('pill', { status: 'selected' }, { backgroundColor: 'p06', color: 'n01' })
    .setElement('pillCount', {
      ...defaultTypography,
      color: 'n04',
      fontSize: '12px',
      fontWeight: 'semibold',
      letterSpacing: '0.4px',
      lineHeight: '16px'
    })
    .setElement(
      'pillCount',
      { status: 'selected' },
      { color: styles.Utils.getColorWithOpacity(styles.colors.n01, 0.56) }
    )
    .setElement('segmentedTab', {
      ...defaultTypography,
      backgroundColor: 'n02',
      borderRadius: '16px',
      color: 'n05',
      fontSize: '14px',
      fontWeight: 'semibold',
      letterSpacing: '0.2px',
      lineHeight: '20px',
      textAlign: 'center'
    })
    .setElement('segmentedTab', { status: 'hover' }, { backgroundColor: 'n03' })
    .setElement('segmentedTab', { status: 'selected' }, { backgroundColor: 'p06', color: 'n01' })
    .setElement('segmentedTab', { variant: 'disabled' }, { backgroundColor: 'n02', color: 'n05' })
    .setElement('segmentedTab', { status: 'selected', variant: 'disabled' }, { backgroundColor: 'p06', color: 'n01' })
    .setElement('segmentedTabs', { backgroundColor: 'n02', borderRadius: '16px' })
    .setElement('pillCount', { variant: 'info' }, { color: styles.Utils.getColorWithOpacity(styles.colors.i06, 0.56) })
    .setElement('small', { ...defaultTypography, fontSize: '14px', letterSpacing: '0.4px', lineHeight: '20px' })
    .setElement('small', { variant: 'error' }, { color: 'e06' })
    .setElement('tradeInputAsset', { assetIconSize: 24, color: 'n06', dropdownIconSize: 24, placeholderColor: 'n04' })
    .setElement('xsmall', { ...defaultTypography, fontSize: '12px', letterSpacing: '0.4px', lineHeight: '16px' })
    .setElement('xxsmall', { ...defaultTypography, fontSize: '8px', letterSpacing: '2px', lineHeight: '10px' })
    .setElement('checkbox', {
      color: 'n06',
      fontFamily: 'Metropolis',
      fontSize: '14px',
      letterSpacing: '0.4px',
      lineHeight: '20px'
    })
    .setElement('checkbox', { status: 'disable' }, { color: 'n04' })
    .setElement('error', {
      color: 'e06'
    })
    .setElement('input', {
      '-webkit-text-fill-color': 'n06 !important',
      backgroundColor: 'transparent',
      borderColor: 'n04',
      borderRadius: '8px',
      borderStyle: 'solid',
      borderWidth: '2px',
      color: 'n06',
      fontFamily: 'Metropolis',
      fontSize: '16px',
      letterSpacing: '0.2px',
      lineHeight: '30px'
    })
    .setElement('input', { status: 'disable' }, { backgroundColor: 'n02', color: 'n04' })
    .setElement('input', { status: 'focus' }, { borderColor: 'n06' })
    .setElement('input', { status: 'hover' }, { borderColor: 'n06' })
    .setElement('input', { variant: 'error' }, { borderColor: 'e06' })
    .setElement('input', { variant: 'secondary' }, { backgroundColor: 'n02', borderWidth: 0 })
    .setElement('input', { status: 'hover', variant: 'secondary' }, { backgroundColor: 'n03', borderWidth: 0 })
    .setElement(
      'input',
      { status: 'disable', variant: 'error' },
      { backgroundColor: 'n02', borderColor: 'e06', color: 'n04' }
    )
    .setElement('label', { color: 'n06' })
    .setElement('label', { status: 'disable' }, { color: 'n05' })
    .setElement('label', { status: 'focus' }, { color: 'n06' })
    .setElement('label', { variant: 'error' }, { color: 'e06' })
    .setElement('placeholder', { color: 'n045' })
    .setElement('placeholder', { variant: 'secondary' }, { color: 'n045' })
    .setElement('select', { backgroundColor: 'transparent', color: 'n06' })
    .setElement('select', { status: 'disable' }, { backgroundColor: 'n02', color: 'n04' })
    .getTheme();

// Forced dark theme
export const theme = getTheme('dark');
