import I18n from '../translations';
import routes from '../fixtures/routes.json';

const addressId = 'address';
const assetId = 'asset';
const dynamicFormPortalId = '#dynamicFormPortal';

const checkAccess = () => {
  cy.location('pathname').should('be.equal', routes.access);
};

const setAddress = from => {
  cy.typeAndCheck(addressId, from);
};

const selectNetwork = value => {
  cy.findAndClick(assetId);
  cy.get(dynamicFormPortalId).within(() => {
    cy.findAllByText(value).eq(0).click();
  });
};

const checkInvalid = currency => {
  cy.checkVisibleAndContains('errorToast', I18n.t('access.fields.address.errors.invalid', { currency }));
};

const checkRequired = currency => {
  cy.checkVisibleAndContains('errorToast', I18n.t('access.fields.address.errors.required', { currency }));
};

export default {
  checkAccess,
  checkInvalid,
  checkRequired,
  selectNetwork,
  setAddress
};
