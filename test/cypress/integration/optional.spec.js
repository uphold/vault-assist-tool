import accessDetails from '../pages/access.details';
import accessPage from '../pages/access.page';
import landingPage from '../pages/landing.page';
import routes from '../fixtures/routes.json';
import transactionSuccess from '../pages/transaction.success';
import vaultHelper from '../support/helpers/vault';
import withdrawXrpConfirm from '../pages/withdraw.xrp.confirm';
import withdrawXrpDestination from '../pages/withdraw.xrp.destination';
import withdrawXrpPage from '../pages/withdraw.xrp.page';

const defaultCrypto = 'XRP';
const destinationTag = '321';
const { landing } = routes;

let wallets = { signerWallets: [], vaultAddress: '' };

describe(`Creating test account (WARNING: this takes 15 minutes)`, { scrollBehavior: false }, () => {
  before(() => {
    //Create vault test wallets
    cy.wrap(null).then(async () => {
      wallets = await vaultHelper.createVaultTestWallets();

      //------------------------------------------------------------------
      //WARNING: It takes ~15 minutes before account is allowed to be closed.
      //See 'tec_TOO_SOON' : https://xrpl.org/tec-codes.html#tec-codes
      //------------------------------------------------------------------

      //eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(900000);
    });
  });

  beforeEach(() => {
    cy.visit(landing);
    landingPage.checkLanding();
  });

  describe(`Set account details`, { scrollBehavior: false }, () => {
    beforeEach(() => {
      cy.clickAccess();
      accessPage.checkAccess();
      accessPage.selectAsset(defaultCrypto);

      accessPage.setAddress(wallets.vaultAddress);
      cy.clickSubmit();
      accessDetails.checkAccessDetails();

      cy.clickWithdraw();
      withdrawXrpPage.checkWithdraw();

      cy.clickContinue();
      withdrawXrpDestination.checkWithdrawDestination();

      withdrawXrpDestination.setAddress(wallets.destination);
      withdrawXrpDestination.setDestinationTag(destinationTag);
      cy.clickSubmit();
      withdrawXrpConfirm.checkWithdrawConfirm();
    });

    describe(`Submit transaction`, { scrollBehavior: false }, () => {
      beforeEach(() => {
        withdrawXrpConfirm.setVaultKey(wallets.signerWallets[0].key);
        withdrawXrpConfirm.setBackupKey(wallets.signerWallets[1].key);
        cy.clickConfirmWithdraw();
      });

      it('should be successful with transaction details', () => {
        transactionSuccess.checkTransactionSuccess();
        transactionSuccess.containsDetails(wallets.destination, destinationTag);
      });

      after(() => {
        cy.clickEndSession();
        landingPage.checkLanding();
      });
    });
  });
});
