import { formatNumber } from '../../../src/utils/formatNumber';
import { getCurrency } from '../../../src/lib/vault';
import I18n from '../translations';
import routes from '../fixtures/routes.json';

const checkAccessDetails = () => {
  cy.location('pathname').should('be.equal', routes.accessDetails);
};

const clickWithdrawAsset = value => {
  cy.findAllByText(I18n.t('actions.withdraw', { currency: value }))
    .eq(0)
    .click();
};

const containsDetails = ({ address, balance, reserve, currency, trustlines }) => {
  const remainingBalance = Number(balance) - Number(reserve);

  if (trustlines) {
    trustlines.map(({ currency, balance }) => {
      cy.contains(`${formatNumber(balance)} ${getCurrency(currency)}`);
    });
  }

  cy.contains(address);
  cy.contains(`${formatNumber(remainingBalance)} ${currency}`);
  cy.contains(`${formatNumber(reserve)} ${currency}`);
};

export default {
  checkAccessDetails,
  clickWithdrawAsset,
  containsDetails
};
