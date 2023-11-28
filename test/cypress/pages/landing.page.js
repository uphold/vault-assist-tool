import I18n from '../translations';
import routes from '../fixtures/routes.json';

const checkLanding = () => {
  cy.location('pathname').should('be.equal', routes.landing);
};

const checkSiteWarning = () => {
  cy.findByTestId('alertMessage').should('include.text', I18n.t('landing.warning.check'));
};

export default {
  checkLanding,
  checkSiteWarning
};
