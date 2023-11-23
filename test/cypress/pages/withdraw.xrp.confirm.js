import I18n from '../translations';
import routes from '../fixtures/routes.json';

const vaultKeyId = 'vaultKey';
const backupKeyId = 'backupKey';

const checkWithdrawConfirm = () => {
  cy.location('pathname').should('be.equal', routes.withdrawXrpConfirm);
};

const setVaultKey = (key) => {
  cy.typeAndCheck(vaultKeyId, key);
};

const setBackupKey = (key) => {
  cy.typeAndCheck(backupKeyId, key);
};

const checkVaultKeyInvalid = () => {
  cy.checkVisibleAndContains('errorToast', I18n.t('withdraw.xrp.confirm.fields.vault.key.errors.invalid'));
};

const checkBackupKeyInvalid = () => {
  cy.checkVisibleAndContains('errorToast', I18n.t('withdraw.xrp.confirm.fields.backup.key.errors.invalid'));
};

const checkKeysInvalid = () => {
  cy.checkVisibleAndContains('errorToast', I18n.t('withdraw.xrp.confirm.fields.keys.error.invalid'));
};

const checkVaultKeyRequired = () => {
  cy.checkVisibleAndContains('errorToast', I18n.t('withdraw.xrp.confirm.fields.vault.key.errors.required'));
};

const checkBackupKeyRequired = () => {
  cy.checkVisibleAndContains('errorToast', I18n.t('withdraw.xrp.confirm.fields.backup.key.errors.required'));
};

export default {
  checkBackupKeyInvalid,
  checkBackupKeyRequired,
  checkKeysInvalid,
  checkVaultKeyInvalid,
  checkVaultKeyRequired,
  checkWithdrawConfirm,
  setBackupKey,
  setVaultKey,
};
