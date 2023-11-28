import 'tippy.js/dist/tippy.css';
import './lib/i18n/i18n';
import '@typehaus/metropolis';
import 'fast-text-encoding';

import { App } from './App';
import { ThemeProvider } from './lib/theme/provider';
import { base, reset } from './lib/styles';
import { createGlobalStyle } from 'styled-components';
import { createRoot } from 'react-dom/client';
import { tippy } from './lib/styles/tippy';
import { withTranslation } from 'react-i18next';

const AppWithTranslation = withTranslation()(App);

const GlobalStyle = createGlobalStyle`
  ${base}
  ${reset}
  ${tippy}
`;

const VaultAssistApp = () => (
  <ThemeProvider>
    <GlobalStyle />

    <AppWithTranslation />
  </ThemeProvider>
);

window.onload = () => {
  const root = createRoot(document.getElementById('app'));

  root.render(<VaultAssistApp />);
};
