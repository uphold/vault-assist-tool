import I18n from '../../translations';

const defaultCrypto = 'XRP';

const actionsAccess = I18n.t('actions.accessVault');
const actionsConfirmWithdraw = I18n.t('actions.confirm.withdraw');
const actionsContinue = I18n.t('actions.continue');
const actionsEndSession = I18n.t('actions.end.session');
const actionsFailureClose = I18n.t('actions.close');
const actionsOkay = I18n.t('actions.okay');
const actionsSubmit = I18n.t('actions.submit');
const actionsViewTransaction = I18n.t('actions.view.transaction');
const actionsWithdraw = I18n.t('actions.withdraw', { currency: defaultCrypto });
const actionsWithdrawAvailableXrp = I18n.t('actions.withdraw.xrp');
const actionsWithdrawTokens = I18n.t('actions.withdraw.tokens');
const button = 'button-primary';
const closeButton = 'close';

const clickAction = id => {
  return (index = 0) => {
    cy.findAllByTestId(id).eq(index).click();
  };
};

const clickActionByText = text => {
  return (index = 0) => {
    cy.findAllByText(text).eq(index).click();
  };
};

const visitPage = (route, query) => {
  if (query) {
    return () => cy.visitAndWaitForRequest(route, query);
  }

  return () => cy.visit(route);
};

Cypress.Commands.add('clickBackButton', (times = 1) => {
  for (let clickTimes = 0; clickTimes < times; clickTimes++) {
    cy.findAllByTestId('back').eq(0).click();
  }
});

Cypress.Commands.addAll({
  clickAccess: clickActionByText(actionsAccess),
  clickCloseButton: clickAction(closeButton),
  clickConfirmWithdraw: clickActionByText(actionsConfirmWithdraw),
  clickContinue: clickActionByText(actionsContinue),
  clickDefaultButton: clickAction(button),
  clickEndSession: clickActionByText(actionsEndSession),
  clickFailureClose: clickActionByText(actionsFailureClose),
  clickOkay: clickActionByText(actionsOkay),
  clickSubmit: clickActionByText(actionsSubmit),
  clickViewTransaction: clickActionByText(actionsViewTransaction),
  clickWithdraw: clickActionByText(actionsWithdraw),
  clickWithdrawAvailableXrp: clickActionByText(actionsWithdrawAvailableXrp),
  clickWithdrawTokens: clickActionByText(actionsWithdrawTokens),
  visitPage
});

Cypress.Commands.add('checkSuccessAnimation', () => {
  cy.checkVisible('okAnimation');
});

Cypress.Commands.add('checkFieldValidated', validationMessages => {
  validationMessages.forEach(message => {
    if (['lowercase', 'minLength', 'numberOrSpecialCharacter', 'uppercase'].includes(message)) {
      return cy.findByTestId(message).should('have.css', 'text-decoration-line', 'line-through');
    }

    cy.checkVisibleText(I18n.t(message));
  });
});
