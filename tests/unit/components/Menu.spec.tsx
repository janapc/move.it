import { fireEvent, render } from "@testing-library/react";
import * as nextRouter from "next/router";

import { Menu } from "../../../src/components/Menu";

const localStorageMock = (function () {
  let store = {};

  return {
    getItem: function (key) {
      return store[key] || null;
    },
    setItem: function (key, value) {
      store[key] = value.toString();
    },
    removeItem: function (key) {
      delete store[key];
    },
    clear: function () {
      store = {};
    }
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("Menu Component", () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it("Should render the component of Menu correctly", () => {
    const router = { push: jest.fn(), pathname: "/dashboard/home" };
    jest.spyOn(nextRouter, "useRouter").mockReturnValue(router);

    const { getByTestId } = render(<Menu />);

    expect(getByTestId("menu")).toBeTruthy();

    const home = getByTestId("btn-change-route-home");
    const leaderboard = getByTestId("btn-change-route-leaderboard");
    const theme = getByTestId("btn-theme");

    expect(home.lastChild).toHaveAttribute("src", "/icons/home-selected.svg");

    expect(leaderboard.lastChild).toHaveAttribute(
      "src",
      "/icons/leaderboard.svg"
    );

    expect(theme.lastChild).toHaveAttribute("src", "/icons/sun.svg");
  });

  it("Should change route to leaderboard", () => {
    const router = { push: jest.fn(), pathname: "/dashboard/home" };

    const spyRouter = jest
      .spyOn(nextRouter, "useRouter")
      .mockImplementationOnce(() => {
        return router;
      })
      .mockImplementationOnce(() => {
        return {
          push: jest.fn(),
          pathname: "/dashboard/leaderboard"
        };
      });

    const { getByTestId, rerender } = render(<Menu />);

    const home = getByTestId("btn-change-route-home");
    const leaderboard = getByTestId("btn-change-route-leaderboard");
    const theme = getByTestId("btn-theme");

    fireEvent.click(leaderboard);

    rerender(<Menu />);

    expect(spyRouter).toBeCalledTimes(2);
    expect(home.lastChild).toHaveAttribute("src", "/icons/home.svg");

    expect(leaderboard.lastChild).toHaveAttribute(
      "src",
      "/icons/leaderboard-selected.svg"
    );

    expect(theme.lastChild).toHaveAttribute("src", "/icons/sun.svg");
  });
  it("Should change theme to dark", async () => {
    const spyLocalStorageGet = jest.spyOn(localStorage, "getItem");
    const spyLocalStorageSet = jest.spyOn(localStorage, "setItem");
    const router = { push: jest.fn(), pathname: "/dashboard/home" };
    jest.spyOn(nextRouter, "useRouter").mockReturnValue(router);

    const { getByTestId } = render(<Menu />);
    expect(spyLocalStorageGet).toBeCalled();

    expect(getByTestId("menu")).toBeTruthy();

    const theme = getByTestId("btn-theme");

    fireEvent.click(theme);
    expect(spyLocalStorageSet).toHaveBeenCalled();

    expect(theme.lastChild).toHaveAttribute("src", "/icons/moon.svg");
  });
});
