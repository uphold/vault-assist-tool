import accessDetails from '../pages/access.details';
import accessPage from '../pages/access.page';
import landingPage from '../pages/landing.page';
import routes from '../fixtures/routes.json';
import transactionSuccess from '../pages/transaction.success';
import vaultHelper from '../support/helpers/vault';
import withdrawXrpConfirm from '../pages/withdraw.xrp.confirm';
import withdrawXrpDestination from '../pages/withdraw.xrp.destination';
import withdrawXrpNotice from '../pages/withdraw.xrp.notice';
import withdrawXrpPage from '../pages/withdraw.xrp.page';

const defaultCrypto = 'XRP';
const destinationTag = '321';
const { landing } = routes;

let wallets = {
  destination: '',
  signerWallets: [],
  tokenList: [],
  tokenName: '',
  trustlines: [],
  vaultAddress: '',
  vaultBalance: '0',
  vaultReserve: '0',
  vaultTokenBalance: '0'
};

cy.config('defaultCommandTimeout', 60000);

describe(`Landing`, { scrollBehavior: false }, () => {
  before(() => {
    //Create vault test wallets
    cy.wrap(null).then(async () => {
      wallets = await vaultHelper.createVaultAndTokenTestWallets();

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
    window.localStorage.setItem('testTokenList', JSON.stringify(wallets.tokenList));
  });

  describe(`Set account details`, { scrollBehavior: false }, () => {
    beforeEach(() => {
      cy.clickAccess();
      accessPage.checkAccess();
    });

    it('account details should contain the address, xrp balance, token balance, and reserve', () => {
      accessPage.selectAsset(wallets.tokenName);
      accessPage.setAddress(wallets.vaultAddress);
      cy.clickSubmit();
      accessDetails.checkAccessDetails();

      accessDetails.containsDetails({
        address: wallets.vaultAddress,
        balance: wallets.vaultBalance,
        currency: defaultCrypto,
        reserve: wallets.vaultReserve,
        trustlines: wallets.trustlines
      });
    });

    it('should be able to withdraw xrp balance without closing vault', () => {
      accessPage.selectAsset(defaultCrypto);
      accessPage.setAddress(wallets.vaultAddress);

      cy.clickSubmit();
      accessDetails.checkAccessDetails();

      cy.clickWithdrawCrypto();
      withdrawXrpNotice.checkWithdrawNotice();

      cy.clickWithdrawAvailableXrp();
      withdrawXrpDestination.checkWithdrawDestination();

      withdrawXrpDestination.setAddress(wallets.destination);
      withdrawXrpDestination.setDestinationTag(destinationTag);

      cy.clickSubmit();
      withdrawXrpConfirm.checkWithdrawConfirm();

      withdrawXrpConfirm.setVaultKey(wallets.signerWallets[0].key);
      withdrawXrpConfirm.setBackupKey(wallets.signerWallets[1].key);
      cy.clickConfirmWithdraw();

      transactionSuccess.checkTransactionSuccess();
      transactionSuccess.containsDetails(wallets.destination, destinationTag);

      cy.clickEndSession();
      landingPage.checkLanding();
    });

    it('should be able to withdraw tokens and close trust line without closing vault', () => {
      accessPage.selectAsset(defaultCrypto);
      accessPage.setAddress(wallets.vaultAddress);

      cy.clickSubmit();
      accessDetails.checkAccessDetails();

      cy.clickWithdrawCrypto();
      withdrawXrpNotice.checkWithdrawNotice();

      cy.clickWithdrawTokens();
      withdrawXrpNotice.selectAsset(wallets.tokenName);
      withdrawXrpDestination.checkWithdrawDestination();

      withdrawXrpDestination.setAddress(wallets.destination);
      withdrawXrpDestination.setDestinationTag(destinationTag);

      cy.clickSubmit();
      withdrawXrpConfirm.checkWithdrawConfirm();

      withdrawXrpConfirm.setVaultKey(wallets.signerWallets[0].key);
      withdrawXrpConfirm.setBackupKey(wallets.signerWallets[1].key);
      cy.clickConfirmWithdraw();

      transactionSuccess.checkTransactionSuccess();
      transactionSuccess.containsDetails(wallets.destination, destinationTag);

      cy.clickEndSession();
      landingPage.checkLanding();
    });

    it('should be able to withdraw all remaining funds, and close vault', () => {
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

      withdrawXrpConfirm.setVaultKey(wallets.signerWallets[0].key);
      withdrawXrpConfirm.setBackupKey(wallets.signerWallets[1].key);
      cy.clickConfirmWithdraw();

      transactionSuccess.checkTransactionSuccess();
      transactionSuccess.containsDetails(wallets.destination, destinationTag);

      cy.clickEndSession();
      landingPage.checkLanding();
    });
  });
});
