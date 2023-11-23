import { formatNumber } from '../../../src/utils/formatNumber';
import I18n from '../translations';
import routes from '../fixtures/routes.json';

const checkWithdraw = () => {
  cy.location('pathname').should('be.equal', routes.withdrawXrp);
};

const containsDetails = (balance, reserve, ownerReserve, currency) => {
  const remainingBalance = Number(balance) - Number(reserve);

  cy.contains(`${formatNumber(remainingBalance, 2)} ${currency}`);
  cy.contains(`${formatNumber(reserve)} ${currency}`);
  cy.contains(
    I18n.t('withdraw.xrp.conditions.network.costs.text', {
      ownerReserve: formatNumber(ownerReserve, 0, 0),
    })
  );
};

export default {
  checkWithdraw,
  containsDetails,
};
