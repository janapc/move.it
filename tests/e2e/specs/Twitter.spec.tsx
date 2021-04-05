const APP_URL = process.env.APP_URL || "http://localhost:3000";

describe("<Twitter />", () => {
  it("Should render the page with the parameters and create a new certificate", () => {
    cy.visit(`${APP_URL}/twitter`, {
      qs: {
        auth:
          "851452aba22ffac59693618532243525,5647a51c8f9a9a4f85fb5d5bbea79462d4b81766a9b5d510f7cc99871e4d1087,a8402cfcac473c611d94a3606877051aac014ecc958de00d389d6f80c7a195c6cd644b867b75b8117afa99306e5ec265",
      },
    });

    cy.get("[data-testid=level-text]")
      .invoke("text")
      .then((text) => expect(text).to.equal("3"));
    cy.get("[data-testid=challenges-text]")
      .invoke("text")
      .then((text) => expect(text).to.equal("3 completos"));
    cy.get("[data-testid=experience-text]")
      .invoke("text")
      .then((text) => expect(text).to.equal("230 xp"));
  });

  it("Should not render page if not have the parameters necessary", () => {
    cy.visit(`${APP_URL}/twitter`, {
      qs: {
        auth:
          "12312,123,234",
      },
      failOnStatusCode: false
    });

    cy.url().should("include", "/404");
  });
});
