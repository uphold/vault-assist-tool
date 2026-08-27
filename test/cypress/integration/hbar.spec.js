import accessPage from '../pages/access.page';
import landingPage from '../pages/landing.page';
import routes from '../fixtures/routes.json';

const defaultCrypto = 'HBAR';
const { landing } = routes;

describe(`HBAR access`, { scrollBehavior: false }, () => {
  beforeEach(() => {
    cy.visit(landing);
    landingPage.checkLanding();
    cy.clickAccess();
    accessPage.checkAccess();
    accessPage.selectAsset(defaultCrypto);
  });

  it('should require address', () => {
    cy.clickSubmit();
    accessPage.checkRequired(defaultCrypto);
  });

  it('should enter invalid address', () => {
    accessPage.setAddress('not-a-hedera-address');
    cy.clickSubmit();
    accessPage.checkInvalid(defaultCrypto);
  });

  it('should reject an XRP-style address', () => {
    accessPage.setAddress('rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH');
    cy.clickSubmit();
    accessPage.checkInvalid(defaultCrypto);
  });
});
