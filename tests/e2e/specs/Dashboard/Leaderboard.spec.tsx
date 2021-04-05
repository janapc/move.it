const APP_URL = process.env.APP_URL || "http://localhost:3000";

const rankOfUsers = [
  {
    _id: "123",
    username: "Banana1",
    level: 2,
    experience: 50,
    avatar: "",
    challenges: 1,
    twitterUrl: "",
    userId: "1",
  },
  {
    _id: "1233",
    username: "Banana2",
    level: 3,
    experience: 150,
    avatar: "",
    challenges: 3,
    twitterUrl: "",
    userId: "2",
  },
];

describe("<Leaderboard />", () => {
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

    cy.intercept("GET", "/api/rank", {
      statusCode: 200,
      body: { rankOfUsers },
    });

    cy.visit(`${APP_URL}/dashboard/leaderboard`, {
      onBeforeLoad: (win) => {
        win.sessionStorage.setItem(
          "user",
          JSON.stringify({ username: "Banana", avatar: "", token: "banana123" })
        );
      },
    });
  });

  it("Should not render the page of Leaderboard, redirect the user to page of login", () => {
    cy.intercept("GET", "/api/authentication", (req) => {
      req.reply((res) => {
        if (req.headers.authorization) {
          res.send(200, { success: true });
        } else {
          res.send(400, { success: false });
        }
      });
    });

    cy.visit(`${APP_URL}/dashboard/leaderboard`, {
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

    cy.intercept("GET", "/api/rank", {
      statusCode: 200,
      body: {
        rankOfUsers,
      },
    });

    cy.setCookie("level", "2");
    cy.setCookie("currentExperience", "120");
    cy.setCookie("challengesCompleted", "2");
    cy.setCookie("expirenceTotal", "190");

    cy.visit(`${APP_URL}/dashboard/leaderboard`, {
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

  it("Should change the page to the page of Home", () => {
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

    cy.intercept("GET", "/api/rank", {
      statusCode: 200,
      body: {
        rankOfUsers,
      },
    });

    cy.setCookie("level", "2");
    cy.setCookie("currentExperience", "120");
    cy.setCookie("challengesCompleted", "2");
    cy.setCookie("expirenceTotal", "190");

    cy.visit(`${APP_URL}/dashboard/leaderboard`, {
      onBeforeLoad: (win) => {
        win.sessionStorage.setItem(
          "user",
          JSON.stringify({ username: "Banana", avatar: "", token: "banana123" })
        );
      },
    });

    cy.get("[data-testid=btn-change-route-leaderboard]")
      .find("img")
      .should("have.attr", "src", "/icons/leaderboard-selected.svg");
    cy.get("[data-testid=btn-change-route-home]").click();

    cy.url().should("include", "/dashboard/home");
    cy.get("[data-testid=btn-change-route-home]")
      .find("img")
      .should("have.attr", "src", "/icons/home-selected.svg");
  });

  it("Should show a message to the user if have an error in API", () => {
    cy.intercept("GET", "/api/authentication", (req) => {
      req.reply((res) => {
        if (req.headers.authorization) {
          res.send(200, { success: true });
        } else {
          res.send(400, { success: false });
        }
      });
    });

    cy.intercept("GET", "/api/rank", {
      statusCode: 400,
    });

    cy.setCookie("level", "2");
    cy.setCookie("currentExperience", "120");
    cy.setCookie("challengesCompleted", "2");
    cy.setCookie("expirenceTotal", "190");

    cy.visit(`${APP_URL}/dashboard/leaderboard`, {
      onBeforeLoad: (win) => {
        win.sessionStorage.setItem(
          "user",
          JSON.stringify({ username: "Banana", avatar: "", token: "banana123" })
        );
      },
    });

    cy.get("[data-testid=error-rank]").should("be.visible");
  });

  it("Should show a message to the user if not have any user in the leaderboard", () => {
    cy.intercept("GET", "/api/authentication", (req) => {
      req.reply((res) => {
        if (req.headers.authorization) {
          res.send(200, { success: true });
        } else {
          res.send(400, { success: false });
        }
      });
    });

    cy.intercept("GET", "/api/rank", {
      statusCode: 200,
      body: {
        rankOfUsers: [],
      },
    });

    cy.setCookie("level", "2");
    cy.setCookie("currentExperience", "120");
    cy.setCookie("challengesCompleted", "2");
    cy.setCookie("expirenceTotal", "190");

    cy.visit(`${APP_URL}/dashboard/leaderboard`, {
      onBeforeLoad: (win) => {
        win.sessionStorage.setItem(
          "user",
          JSON.stringify({ username: "Banana", avatar: "", token: "banana123" })
        );
      },
    });

    cy.get("[data-testid=not-users]").should("be.visible");
  });
});
