const APP_URL = process.env.APP_URL || "http://localhost:3000";

describe("<Home />", () => {
  beforeEach(() => {
    cy.clearCookies();
  });
  it("Should initial cycle and finish cycle", () => {
    cy.visit(APP_URL);

    cy.get("[data-testid=time]")
      .invoke("text")
      .then((text) => expect(text).to.equal("00:03"));

    cy.get("[data-testid=btn-initial]")
      .invoke("text")
      .then((text) => expect(text).to.contain("Iniciar um ciclo"));

    cy.get("[data-testid=btn-initial]").click();

    cy.wait(3000);

    cy.get("[data-testid=time]")
      .invoke("text")
      .then((text) => expect(text).to.equal("00:00"));

    cy.get("[data-testid=btn-finish]")
      .invoke("text")
      .then((text) => expect(text).to.contain("Ciclo encerrado"));
  });

  it("Should initial cycle and leave cycle", () => {
    cy.visit(APP_URL);

    cy.get("[data-testid=time]")
      .invoke("text")
      .then((text) => expect(text).to.equal("00:03"));

    cy.get("[data-testid=btn-initial]")
      .invoke("text")
      .then((text) => expect(text).to.contain("Iniciar um ciclo"));

    cy.get("[data-testid=btn-initial]").click();

    cy.get("[data-testid=btn-leave]")
      .invoke("text")
      .then((text) => expect(text).to.contain("Abandonar ciclo"));

    cy.get("[data-testid=btn-leave]").click();
  });

  it("Should initial cycle and finish a challenge", () => {
    cy.visit(APP_URL);

    cy.get("[data-testid=time]")
      .invoke("text")
      .then((text) => expect(text).to.equal("00:03"));

    cy.get("[data-testid=btn-initial]")
      .invoke("text")
      .then((text) => expect(text).to.contain("Iniciar um ciclo"));

    cy.get("[data-testid=btn-initial]").click();

    cy.wait(3000);

    cy.get("[data-testid=btn-succeeded]").click();

    if (cy.get("[data-testid=btn-close-modal]").should("exist")) {
      cy.get("[data-testid=btn-close-modal]").click();
      cy.get("[data-testid=level]").should("contain.text", "2");
    }
    cy.get("[data-testid=challengesCompleted]").should("have.text", "1");
  });

  it("Should initial cycle and no finish a challenge", () => {
    cy.visit(APP_URL);

    cy.get("[data-testid=time]")
      .invoke("text")
      .then((text) => expect(text).to.equal("00:03"));

    cy.get("[data-testid=btn-initial]")
      .invoke("text")
      .then((text) => expect(text).to.contain("Iniciar um ciclo"));

    cy.get("[data-testid=btn-initial]").click();

    cy.wait(3000);

    cy.get("[data-testid=btn-failed]").click();
  });
});
