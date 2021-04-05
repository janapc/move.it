const APP_URL = process.env.APP_URL || "http://localhost:3000";

describe("<Login />", () => {
  beforeEach(() => {
    cy.clearCookies();
  });
  it("Should make the login of user and redirect to page Dashboard", () => {
    cy.intercept("GET", "/api/authentication", (req) => {
      req.reply((res) => {
        if (req.headers.authorization) {
          res.send(200, { success: true });
        } else {
          res.send(400, { success: false });
        }
      });
    });

    cy.intercept("GET", "https://api.github.com/users/banana", {
      statusCode: 200,
      body: {
        login: "Banana",
        avatar_url: "",
        id: "banana123",
        node_id: "banana123",
      },
    }).as("github");

    cy.intercept("POST", "/api/authentication", {
      statusCode: 201,
      body: {
        token: "123banana123",
      },
    }).as("postAuthentication");

    cy.intercept("POST", "/api/user", {
      statusCode: 200,
      body: {
        success: true,
      },
    }).as("user");

    cy.visit(`${APP_URL}/login`, {
      onBeforeLoad: (win) => {
        win.sessionStorage.clear();
      },
    });

    cy.get("[data-testid=input-username]").type("banana");
    cy.get("[data-testid=input-username]").should("have.value", "banana");
    cy.get("[data-testid=btn-login]").click();
    cy.wait("@github");
    cy.wait("@postAuthentication");
    cy.wait("@user");

    cy.setCookie("level", "2");
    cy.setCookie("currentExperience", "90");
    cy.setCookie("challengesCompleted", "2");
    cy.setCookie("expirenceTotal", "190");
    cy.url().should("include", "/dashboard/home");

    cy.get("[data-testid=level]")
      .invoke("text")
      .then((text) => expect(text).to.equal("Level 2"));

    cy.get("[data-testid=challengesCompleted]")
      .invoke("text")
      .then((text) => expect(text).to.equal("2"));

    cy.get("[data-testid=bar-left-percent]")
      .invoke("text")
      .then((text) => expect(text).to.equal("90 xp"));
    cy.get("[data-testid=name]")
      .invoke("text")
      .then((text) => expect(text).to.equal("Banana"));
  });

  it("Should not make the login of the user", () => {
    cy.intercept("GET", "/api/authentication", (req) => {
      req.reply((res) => {
        if (req.headers.authorization) {
          res.send(200, { success: true });
        } else {
          res.send(400, { success: false });
        }
      });
    });

    cy.intercept("GET", "https://api.github.com/users/banana", {
      statusCode: 400,
      body: {
        success: false,
      },
    }).as("github");

    cy.visit(`${APP_URL}/login`, {
      onBeforeLoad: (win) => {
        win.sessionStorage.clear();
      },
    });

    cy.get("[data-testid=input-username]").type("banana");
    cy.get("[data-testid=input-username]").should("have.value", "banana");
    cy.get("[data-testid=btn-login]").click();
    cy.wait("@github");

    cy.get("[data-testid=has-error]")
      .invoke("text")
      .then((text) =>
        expect(text).to.equal("Ocorreu algum erro inesperado com seu login =(")
      );
  });
});
