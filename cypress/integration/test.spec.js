/* eslint-disable no-undef */
const doNewUser = true;

function makeId(length) {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function makeEmail() {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  var charactersLength = characters.length;
  for (var i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  const devEmail = Cypress.env("DEV_EMAIL");
  var prepend = devEmail.split("@")[0] + "+" + result;
  var append = devEmail.split("@")[1];
  return prepend + "@" + append;
}

describe("Full test of critical functionality", () => {
  var total_token_balance = 0;

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
    cy.contains("Casper Token Total Balance");
    cy.wait(2000);
  });

  it("should get total_token_balance", () => {
    cy.get("h2#total-balance")
      .eq(0)
      .then((e) => {
        total_token_balance = parseInt(e.text().replace(",", ""));
      });
    cy.wait(2000);
  });

  if (doNewUser) {
    it("should add user", () => {
      cy.visit("/app/user/new");
      cy.get("input").eq(0).clear().type(makeId(5));
      cy.get("input").eq(1).clear().type("testuser");
      cy.get("input").eq(2).clear().type(makeEmail());
      cy.get("select").eq(0).select(1);
      cy.get("input").eq(3).clear().type(100);
      cy.get("button").contains("Save User").click();
      total_token_balance += 100;
      cy.wait(6000);
    });

    it("should add fund user", () => {
      cy.visit("/app/user/new");
      cy.get("input").eq(0).clear().type(makeId(5));
      cy.get("input").eq(1).clear().type("testfunduser");
      cy.get("input").eq(2).clear().type(makeEmail());
      cy.get("select").eq(0).select(2);
      cy.get("input").eq(3).clear().type(200);
      cy.get("button").contains("Save User").click();
      total_token_balance += 200;
      cy.wait(6000);
    });
  }

  it("should update for inflation by 50 tokens", () => {
    cy.visit("/");
    cy.get("a#update-inflation-btn").eq(0).click();
    cy.get("#update-inflation-modal input:first")
      .clear()
      .type(total_token_balance + 50);
    cy.get("#update-inflation-modal button").contains("Submit").click();
    total_token_balance += 50;
    cy.wait(5000);
  });

  it("should process a deposit", () => {
    cy.visit("/");
    cy.get("a#process-deposit-btn").eq(0).click();
    cy.wait(2000);
    cy.get("#process-deposit-admin-modal select").eq(0).select(1);
    cy.get("#process-deposit-admin-modal input:first").clear().type(60);
    cy.get("#process-deposit-admin-modal a").contains("Submit").click();
    total_token_balance += 60;
    cy.wait(5000);
  });

  it("should process a withdraw", () => {
    cy.visit("/");
    cy.get("a#process-withdraw-btn").eq(0).click();
    cy.wait(2000);
    cy.get("#process-withdraw-admin-modal select").eq(0).select(1);
    cy.get("#process-withdraw-admin-modal input:first").clear().type(10);
    cy.get("#process-withdraw-admin-modal a").contains("Submit").click();
    total_token_balance -= 10;
    cy.wait(5000);
  });
});
