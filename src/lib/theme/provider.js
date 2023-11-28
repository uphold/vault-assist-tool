import { ThemeProvider as SCThemeProvider } from 'styled-components';
import { ThemePreference, getTheme } from './lib';
import { createContext, useMemo } from 'react';
import PropTypes from 'prop-types';

export const ThemeContext = createContext();

export const DSThemeProvider = ({ themeName, ...props }) => {
  const theme = useMemo(() => getTheme(themeName), [themeName]);

  return <ThemeContext.Provider value={theme} {...props} />;
};

export const ThemeProvider = ({ theme: providedTheme, themeName, ...props }) => {
  const theme = useMemo(() => {
    const themeProvided = getTheme(themeName);

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
