import { ThemeContext as ProivderThemeContext } from './provider';
import { theme as baseTheme } from './lib';
import ThemeBuilder from './ThemeBuilder';

export const ThemeContext = ProivderThemeContext;

export const ThemePreference = Object.freeze({
  Dark: 'dark',
  Light: 'dark',
  System: 'system'
});

export const getTheme = themeName =>
  new ThemeBuilder(baseTheme(themeName))
    .setTheme(themeName)
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
