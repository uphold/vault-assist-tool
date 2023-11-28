import { ThemeProvider as SCThemeProvider } from 'styled-components';
import { ThemePreference } from './config';
import { createContext, useMemo } from 'react';
import { getThemeSettings } from './helpers';
import PropTypes from 'prop-types';

export const ThemeContext = createContext();

export const DSThemeProvider = ({ themeName, ...props }) => {
  const theme = useMemo(() => getThemeSettings(themeName), [themeName]);

  return <ThemeContext.Provider value={theme} {...props} />;
};

export const ThemeProvider = ({ theme: providedTheme, themeName, ...props }) => {
  const theme = useMemo(() => {
    const themeProvided = getThemeSettings(themeName);

    return { ...providedTheme, ...themeProvided };
  }, [providedTheme, themeName]);

  return (
    <DSThemeProvider themeName={themeName}>
      <SCThemeProvider theme={theme} {...props} />
    </DSThemeProvider>
  );
};

DSThemeProvider.defaultProps = {
  theme: {},
  themeName: ThemePreference.Dark
};

DSThemeProvider.propTypes = {
  theme: PropTypes.object,
  themeName: PropTypes.oneOf(Object.values(ThemePreference))
};

ThemeProvider.defaultProps = {
  theme: {},
  themeName: ThemePreference.Dark
};

ThemeProvider.propTypes = {
  theme: PropTypes.object,
  themeName: PropTypes.oneOf(Object.values(ThemePreference))
};
