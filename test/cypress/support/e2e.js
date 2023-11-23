import '@testing-library/cypress/add-commands';
import './commands/elements';
import './commands/operations';
import 'cypress-real-events/support';
import 'cypress-pipe';
import { configure } from '@testing-library/cypress';
import registerCypressGrep from '@cypress/grep/src/support';

registerCypressGrep();

configure({ testIdAttribute: 'data-test' });

Cypress.on('uncaught:exception', () => {
  return false;
});
