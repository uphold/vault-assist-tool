import I18n from '../translations';
import routes from '../fixtures/routes.json';

const addressId = 'address';
const destinationTagId = 'destinationTag';

const checkWithdrawDestination = () => {
  cy.location('pathname').should('be.equal', routes.withdrawXrpDestination);
};

const setAddress = (from) => {
  cy.typeAndCheck(addressId, from);
};

const setDestinationTag = (tag) => {
  cy.typeAndCheck(destinationTagId, tag);
};

const checkInvalidAddress = () => {
  cy.checkVisible('errorToast', I18n.t('withdraw.xrp.destination.fields.address.errors.invalid.xrp'));
};

const checkInvalidDestinationTag = () => {
  cy.checkVisible('errorToast', I18n.t('withdraw.xrp.destination.fields.destination.tag.errors.invalid'));
};

const checkRequired = () => {
  cy.checkVisible('errorToast', I18n.t('withdraw.xrp.destination.fields.address.errors.required'));
};

export default {
  checkInvalidAddress,
  checkInvalidDestinationTag,
  checkRequired,
  checkWithdrawDestination,
  setAddress,
  setDestinationTag,
};
