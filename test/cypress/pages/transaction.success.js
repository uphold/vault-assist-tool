import routes from '../fixtures/routes.json';

const checkTransactionSuccess = () => {
  cy.location('pathname').should('be.equal', routes.transactionSuccess);
};

const containsDetails = (address, destinationTag) => {
  cy.contains(address);
  cy.contains(destinationTag);
};

export default {
  checkTransactionSuccess,
  containsDetails,
};
