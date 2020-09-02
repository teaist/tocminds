context('Settings', () => {
  before(() => {
    cy.getCookie('minds_sess').then(sessionCookie => {
      if (sessionCookie === null) {
        return cy.login(true);
      }
    });
  });

  it('should load settings', () => {
    cy.visit('/settings');
  });
});
