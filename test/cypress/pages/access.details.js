import { formatNumber } from '../../../src/utils/formatNumber';
import routes from '../fixtures/routes.json';

const checkAccessDetails = () => {
  cy.location('pathname').should('be.equal', routes.accessDetails);
};

const containsDetails = (address, balance, reserve, currency) => {
  const remainingBalance = Number(balance) - Number(reserve);

  cy.contains(address);
  cy.contains(`${formatNumber(remainingBalance)} ${currency}`);
  cy.contains(`${formatNumber(reserve)} ${currency}`);
};

export default {
  checkAccessDetails,
  containsDetails
};
