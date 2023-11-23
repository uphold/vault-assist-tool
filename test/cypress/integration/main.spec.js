import accessDetails from '../pages/access.details';
import accessPage from '../pages/access.page';
import landingPage from '../pages/landing.page';
import routes from '../fixtures/routes.json';
import transactionFailure from '../pages/transaction.failure';
import vaultHelper from '../support/helpers/vault';
import withdrawXrpConfirm from '../pages/withdraw.xrp.confirm';
import withdrawXrpDestination from '../pages/withdraw.xrp.destination';
import withdrawXrpPage from '../pages/withdraw.xrp.page';

const defaultCrypto = 'XRP';
const destinationTag = '321';
const { landing } = routes;

let wallets = { signerWallets: [], vaultAddress: '' };

describe(`Landing`, { scrollBehavior: false }, () => {
  before(() => {
    //Create vault test wallets
    cy.wrap(null).then(async () => {
      wallets = await vaultHelper.createVaultTestWallets();
    });
  });

  beforeEach(() => {
    cy.visit(landing);
    landingPage.checkLanding();
  });

  it('should create test wallets', () => {
    assert(wallets.signerWallets.length === 3 && wallets.vaultAddress.length);
  });

  it('should have disclaimer', () => {
    landingPage.checkSiteWarning();
  });

  it('should navigate to access vault', () => {
    cy.clickAccess();
    accessPage.checkAccess();
  });

  describe(`Access vault`, { scrollBehavior: false }, () => {
    beforeEach(() => {
      cy.clickAccess();
      accessPage.checkAccess();
      accessPage.selectNetwork(defaultCrypto);
    });

    it('should require address', () => {
      cy.clickSubmit();
      accessPage.checkRequired(defaultCrypto);
    });

    it('should enter invalid address', () => {
      accessPage.setAddress('12345');
      cy.clickSubmit();
      accessPage.checkInvalid(defaultCrypto);
    });

    it('should be able to navigate back to landing', () => {
      cy.clickBackButton();
      landingPage.checkLanding();
    });

    describe(`Get vault details`, { scrollBehavior: false }, () => {
      beforeEach(() => {
        accessPage.setAddress(wallets.vaultAddress);
        cy.clickSubmit();
        accessDetails.checkAccessDetails();
      });

      it('should contain the address, balance, and reserve', () => {
        accessDetails.containsDetails(wallets.vaultAddress, wallets.vaultBalance, wallets.vaultReserve, defaultCrypto);
      });

      it('should be able to navigate back to access', () => {
        cy.clickBackButton();
        accessPage.checkAccess();
      });

      describe(`Start withdrawal`, { scrollBehavior: false }, () => {
        beforeEach(() => {
          cy.clickWithdraw();
          withdrawXrpPage.checkWithdraw();
        });

        it('should contain balance, reserve, and network cost', () => {
          withdrawXrpPage.containsDetails(
            wallets.vaultBalance,
            wallets.vaultReserve,
            wallets.ownerReserve,
            defaultCrypto
          );
        });

        it('should be able to navigate back to access', () => {
          cy.clickBackButton();
          accessPage.checkAccess();
        });

        describe(`Set destination`, { scrollBehavior: false }, () => {
          beforeEach(() => {
            cy.clickContinue();
            withdrawXrpDestination.checkWithdrawDestination();
          });

          it('should require address', () => {
            cy.clickSubmit();
            withdrawXrpDestination.checkRequired();
          });

          it('should enter invalid address', () => {
            withdrawXrpDestination.setAddress('12345');
            cy.clickSubmit();
            withdrawXrpDestination.checkInvalidAddress();
          });

          it('should not allow same destination as vault address', () => {
            withdrawXrpDestination.setAddress(wallets.vaultAddress);
            cy.clickSubmit();
            withdrawXrpDestination.checkInvalidAddress();
          });

          it('should enter invalid destination tag', () => {
            withdrawXrpDestination.setAddress(wallets.signerWallets[0].address);
            withdrawXrpDestination.setDestinationTag('abcd');
            cy.clickSubmit();
            withdrawXrpDestination.checkInvalidDestinationTag();
            withdrawXrpDestination.setDestinationTag('-123');
            cy.clickSubmit();
            withdrawXrpDestination.checkInvalidDestinationTag();
          });

          it('should be able to navigate back to start withdraw', () => {
            cy.clickBackButton();
            withdrawXrpPage.checkWithdraw();
          });

          describe(`Confirm vault keys`, { scrollBehavior: false }, () => {
            beforeEach(() => {
              withdrawXrpDestination.setAddress(wallets.destination);
              withdrawXrpDestination.setDestinationTag(destinationTag);
              cy.clickSubmit();
              withdrawXrpConfirm.checkWithdrawConfirm();
            });

            it('should require keys', () => {
              cy.clickConfirmWithdraw();
              withdrawXrpConfirm.checkVaultKeyRequired();
            });

            it('should enter invalid keys', () => {
              withdrawXrpConfirm.setVaultKey('12345');
              withdrawXrpConfirm.setBackupKey('123456');
              cy.clickConfirmWithdraw();
              withdrawXrpConfirm.checkVaultKeyInvalid();
            });

            it('should enter invalid keys that are the same', () => {
              withdrawXrpConfirm.setVaultKey(wallets.signerWallets[0].key);
              withdrawXrpConfirm.setBackupKey(wallets.signerWallets[0].key);
              cy.clickConfirmWithdraw();
              withdrawXrpConfirm.checkKeysInvalid();
            });

            it('should be able to navigate back to set destination', () => {
              cy.clickBackButton();
              withdrawXrpDestination.checkWithdrawDestination();
            });

            describe(`Submit transaction (this takes a few minutes)`, { scrollBehavior: false }, () => {
              beforeEach(() => {
                withdrawXrpConfirm.setVaultKey(wallets.signerWallets[0].key);
                withdrawXrpConfirm.setBackupKey(wallets.signerWallets[1].key);
                cy.clickConfirmWithdraw();
              });

              //XRP accounts that aren't older than ~15 minutes will fail
              it('should fail because vault account is too new', () => {
                transactionFailure.checkTransactionFailure();
              });

              after(() => {
                cy.clickFailureClose();
                landingPage.checkLanding();
              });
            });
          });
        });
      });
    });
  });
});
