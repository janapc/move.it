import { render } from "@testing-library/react";
import * as nextRouter from "next/router";
import { FC } from "react";

import { UserContext } from "../../../src/contexts/UserContext";

import App from "../../../src/pages";

const UserContextValue = {
  user: null,
  isAuthenticated: true,
  saveDataOfUser: jest.fn(),
  loading: false,
};

describe("App", () => {
  it("Should redirect the user to the page of dashboard", async () => {
    const router = { push: jest.fn() };
    jest.spyOn(nextRouter, "useRouter").mockReturnValue(router);
    const wrapper: FC = ({ children }) => (
      <UserContext.Provider value={UserContextValue}>
        {children}
      </UserContext.Provider>
    );

    render(<App />, { wrapper });
    expect(router.push).toHaveBeenCalledWith("/dashboard/home");
  });

  it("Should redirect the user to the page of login", async () => {
    const router = { push: jest.fn() };
    jest.spyOn(nextRouter, "useRouter").mockReturnValue(router);
    UserContextValue.isAuthenticated = false;

    const wrapper: FC = ({ children }) => (
      <UserContext.Provider value={UserContextValue}>
        {children}
      </UserContext.Provider>
    );

    render(<App />, { wrapper });
    expect(router.push).toHaveBeenCalledWith("/login");
  });

  it("Should render a Loading in page", async () => {
    UserContextValue.loading = true;

    const wrapper: FC = ({ children }) => (
      <UserContext.Provider value={UserContextValue}>
        {children}
      </UserContext.Provider>
    );

    const { getByTestId } = render(<App />, { wrapper });
    expect(getByTestId("loading")).toBeTruthy();
  });
});
