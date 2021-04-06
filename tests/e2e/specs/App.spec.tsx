const APP_URL = process.env.APP_URL || "http://localhost:3000";

describe("<App />", () => {
  it("Should redirect the user to page of login", () => {
    cy.intercept("GET", "/api/authentication", (req) => {
      req.reply((res) => {
        if (req.headers.authorization) {
          res.send(200, { success: true });
        } else {
          res.send(400, { success: false });
        }
      });
    });

    cy.visit(APP_URL, {
      onBeforeLoad: (win) => {
        win.sessionStorage.clear();
      },
    });

    cy.url().should("include", "/login");
  });

  it.skip("Should redirect the user to page of dashboard", () => {
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
    })

    cy.visit(APP_URL, {
      onBeforeLoad: (win) => {
        win.sessionStorage.setItem(
          "user",
          JSON.stringify({ username: "Banana", avatar: "", token: "banana123" })
        );
      },
    });
    
    cy.setCookie("level", "2");
    cy.setCookie("currentExperience", "120");
    cy.setCookie("challengesCompleted", "2");
    cy.setCookie("expirenceTotal", "190");

    cy.url().should('include', '/dashboard/home')
  });
});
