import routes from '../fixtures/routes.json';

const dynamicFormPortalId = '#dynamicFormPortal';

const checkWithdrawNotice = () => {
  cy.location('pathname').should('be.equal', routes.withdrawXrpNotice);
};

const selectAsset = value => {
  cy.get(dynamicFormPortalId).within(() => {
    cy.findAllByText(value).eq(0).click();
  });
};

export default {
  checkWithdrawNotice,
  selectAsset
};
