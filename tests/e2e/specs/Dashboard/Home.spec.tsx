const APP_URL = process.env.APP_URL || "http://localhost:3000";

describe("<Home />", () => {
  beforeEach(() => {
    cy.clearCookies();
  });
  it("Should accept a new challenge, level up of the user and share to Twitter", () => {
    cy.intercept("GET", "/api/authentication", (req) => {
      req.reply((res) => {
        if (req.headers.authorization) {
          res.send(200, { success: true });
        } else {
          res.send(400, { success: false });
        }
      });
    });

    cy.intercept("POST", "/api/user", {
      statusCode: 200,
      body: {
        success: true,
      },
    });

    cy.setCookie("level", "2");
    cy.setCookie("currentExperience", "120");
    cy.setCookie("challengesCompleted", "2");
    cy.setCookie("expirenceTotal", "190");

    cy.visit(`${APP_URL}/dashboard/home`, {
      onBeforeLoad: (win) => {
        cy.stub(win, "open");
        win.sessionStorage.setItem(
          "user",
          JSON.stringify({ username: "Banana", avatar: "", token: "banana123" })
        );
      },
    });

    cy.get("[data-testid=level]")
      .invoke("text")
      .then((text) => expect(text).to.equal("Level 2"));

    cy.get("[data-testid=challengesCompleted]")
      .invoke("text")
      .then((text) => expect(text).to.equal("2"));

    cy.get("[data-testid=bar-left-percent]")
      .invoke("text")
      .then((text) => expect(text).to.equal("120 xp"));
    cy.get("[data-testid=name]")
      .invoke("text")
      .then((text) => expect(text).to.equal("Banana"));

    cy.get("[data-testid=btn-initial]").click();
    cy.wait(6000);

    cy.get("[data-testid=time]")
      .invoke("text")
      .then((text) => expect(text).to.equal("00:00"));

    cy.get("[data-testid=btn-finish]")
      .invoke("text")
      .then((text) => expect(text).to.contain("Ciclo encerrado"));

    cy.get("[data-testid=btn-succeeded]").click();
    cy.get("[data-testid=modal]").should("be.visible", true);

    cy.get("[data-testid=btn-twitter-modal]").click();
    cy.window().its("open").should("be.called");

    cy.get("[data-testid=btn-close-modal]").click();
    cy.get("[data-testid=level]")
      .invoke("text")
      .then((text) => expect(text).to.equal("Level 3"));
  });

  it("Should not accept a new challenge", () => {
    cy.intercept("GET", "/api/authentication", (req) => {
      req.reply((res) => {
        if (req.headers.authorization) {
          res.send(200, { success: true });
        } else {
          res.send(400, { success: false });
        }
      });
    });

    cy.intercept("POST", "/api/user", {
      statusCode: 200,
      body: {
        success: true,
      },
    });

    cy.setCookie("level", "2");
    cy.setCookie("currentExperience", "90");
    cy.setCookie("challengesCompleted", "2");
    cy.setCookie("expirenceTotal", "190");

    cy.visit(`${APP_URL}/dashboard/home`, {
      onBeforeLoad: (win) => {
        win.sessionStorage.setItem(
          "user",
          JSON.stringify({ username: "Banana", avatar: "", token: "banana123" })
        );
      },
    });

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

    cy.get("[data-testid=btn-initial]").click();
    cy.wait(6000);

    cy.get("[data-testid=time]")
      .invoke("text")
      .then((text) => expect(text).to.equal("00:00"));

    cy.get("[data-testid=btn-finish]")
      .invoke("text")
      .then((text) => expect(text).to.contain("Ciclo encerrado"));

    cy.get("[data-testid=btn-failed]").click();

    cy.get("[data-testid=bar-left-percent]")
      .invoke("text")
      .then((text) => expect(text).to.equal("90 xp"));
  });

  it("Should not render the page of dashboard, redirect the user to page of login", () => {
    cy.intercept("GET", "/api/authentication", (req) => {
      req.reply((res) => {
        if (req.headers.authorization) {
          res.send(200, { success: true });
        } else {
          res.send(400, { success: false });
        }
      });
    });

    cy.visit(`${APP_URL}/dashboard/home`, {
      onBeforeLoad: (win) => {
        win.sessionStorage.clear();
      },
    });

    cy.url().should("include", "/login");
  });

  it("Should change the theme", () => {
    cy.intercept("GET", "/api/authentication", (req) => {
      req.reply((res) => {
        if (req.headers.authorization) {
          res.send(200, { success: true });
        } else {
          res.send(400, { success: false });
        }
      });
    });

    cy.intercept("POST", "/api/user", {
      statusCode: 200,
      body: {
        success: true,
      },
    });

    cy.setCookie("level", "2");
    cy.setCookie("currentExperience", "120");
    cy.setCookie("challengesCompleted", "2");
    cy.setCookie("expirenceTotal", "190");

    cy.visit(`${APP_URL}/dashboard/home`, {
      onBeforeLoad: (win) => {
        win.sessionStorage.setItem(
          "user",
          JSON.stringify({ username: "Banana", avatar: "", token: "banana123" })
        );
      },
    });

    cy.get("[data-theme='light']").should("be.visible");
    cy.get("[data-testid=btn-theme]").click();
    cy.get("[data-theme='dark']").should("be.visible");
  });

  it("Should change the page to the page of Leaderboard", () => {
    cy.intercept("GET", "/api/authentication", (req) => {
      req.reply((res) => {
        if (req.headers.authorization) {
          res.send(200, { success: true });
        } else {
          res.send(400, { success: false });
        }
      });
    });

    cy.intercept("POST", "/api/user", {
      statusCode: 200,
      body: {
        success: true,
      },
    });

    cy.setCookie("level", "2");
    cy.setCookie("currentExperience", "120");
    cy.setCookie("challengesCompleted", "2");
    cy.setCookie("expirenceTotal", "190");

    cy.visit(`${APP_URL}/dashboard/home`, {
      onBeforeLoad: (win) => {
        win.sessionStorage.setItem(
          "user",
          JSON.stringify({ username: "Banana", avatar: "", token: "banana123" })
        );
      },
    });
    cy.get("[data-testid=btn-change-route-home]")
      .find("img")
      .should("have.attr", "src", "/icons/home-selected.svg");
    cy.get("[data-testid=btn-change-route-leaderboard]").click();

    cy.url().should("include", "/dashboard/leaderboard");
    cy.get("[data-testid=btn-change-route-leaderboard]")
      .find("img")
      .should("have.attr", "src", "/icons/leaderboard-selected.svg");
  });
});
