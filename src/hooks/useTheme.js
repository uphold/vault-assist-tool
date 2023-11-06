import { ThemeContext, ThemePreference } from '../lib/theme';
import { useContext } from 'react';

export const useTheme = () => {
  const { colors, name, tokens } = useContext(ThemeContext);

  const isDark = name === ThemePreference.Dark;

  return { colors, isDark, name, tokens };
};
