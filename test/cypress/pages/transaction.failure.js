import routes from '../fixtures/routes.json';

const checkTransactionFailure = () => {
  cy.location('pathname', { timeout: 100000 }).should('be.equal', routes.transactionFailure);
};

export default {
  checkTransactionFailure
};
