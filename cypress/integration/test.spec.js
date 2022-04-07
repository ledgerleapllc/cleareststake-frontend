/* eslint-disable no-undef */

describe("Full test of critical functionality", () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  it("should load the login screen", () => {
    cy.visit("/");
    cy.contains("Sign In");
  });

  it("should login", () => {
    cy.get("input:first").clear().type(Cypress.env("ADMIN_LOGIN_EMAIL"));
    cy.get("input:last")
      .clear()
      .type(Cypress.env("ADMIN_LOGIN_PASSWORD"))
      .type("{enter}");
    cy.wait(5000);
  });

  it("should load dashboard", () => {
    cy.location("pathname").should("eq", "/app");
  });

  it("should have dashboard info", () => {
    cy.get("#app-dashboard-info").should("exist");
    cy.get("#app-dashboard-info").contains("Casper Token Total Balance");
  });

  it("should have users section", () => {
    cy.get("#app-users-section").should("exist");
    cy.get("#app-users-section").contains("Users");
  });

  it("should have tx section", () => {
    cy.get("#app-tx-section").should("exist");
    cy.get("#app-tx-section").contains("Transactions");
  });

  it("should have price section", () => {
    cy.get("#app-price-section").should("exist");
    cy.get("#app-price-section").contains("CSPR Price");
  });

  it("should not have demo section", () => {
    cy.get("#app-demo-section").should("not.exist");
  });
});
