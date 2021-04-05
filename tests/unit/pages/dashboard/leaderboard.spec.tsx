import { render, act } from "@testing-library/react";
import { FC } from "react";
import * as nextRouter from "next/router";
import axios from "axios";

import { UserContext } from "../../../../src/contexts/UserContext";

import Leaderboard from "../../../../src/pages/dashboard/leaderboard";

const UserContextValue = {
  user: { username: "banana", avatar: "", token: "banana123" },
  isAuthenticated: true,
  saveDataOfUser: jest.fn(),
  loading: false,
};

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

function sleep(ms: number) {
  Promise.resolve((resolve) => setTimeout(resolve, ms));
}

describe("Leaderboard", () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });
  it("Should render the page Leaderboard correctly", async () => {
    const router = { push: jest.fn(), pathname: "/dashboard/leaderboard" };
    jest.spyOn(nextRouter, "useRouter").mockReturnValue(router);

    mockedAxios.get.mockImplementation(() => {
      return Promise.resolve({
        data: {
          rankOfUsers: [
            {
              userId: 1,
              avatar: "",
              username: "banana",
              level: 2,
              challenges: 3,
              experience: 200,
            },
            {
              userId: 2,
              avatar: "",
              username: "test",
              level: 4,
              challenges: 5,
              experience: 500,
            },
          ],
        },
      });
    });
    const wrapper: FC = ({ children }) => (
      <UserContext.Provider value={UserContextValue}>
        {children}
      </UserContext.Provider>
    );

    const { getByTestId, getAllByTestId } = render(<Leaderboard />, {
      wrapper,
    });

    await act(async () => await sleep(500));

    expect(getByTestId("leaderboard")).toBeVisible();
    expect(getAllByTestId("user")).toHaveLength(2);
  });

  it("Should render the page Leaderboard without rank of users", async () => {
    const router = { push: jest.fn(), pathname: "/dashboard/leaderboard" };
    jest.spyOn(nextRouter, "useRouter").mockReturnValue(router);

    mockedAxios.get.mockImplementation(() => {
      return Promise.resolve({
        data: {
          rankOfUsers: [],
        },
      });
    });

    const wrapper: FC = ({ children }) => (
      <UserContext.Provider value={UserContextValue}>
        {children}
      </UserContext.Provider>
    );

    const { getByTestId } = render(<Leaderboard />, {
      wrapper,
    });

    await act(async () => await sleep(500));

    expect(getByTestId("not-users")).toBeVisible();
  });

  it("Should show a message of error if have some error", async () => {
    const router = { push: jest.fn(), pathname: "/dashboard/leaderboard" };
    jest.spyOn(nextRouter, "useRouter").mockReturnValue(router);

    mockedAxios.get.mockImplementation(() => {
      return Promise.reject(true);
    });

    const wrapper: FC = ({ children }) => (
      <UserContext.Provider value={UserContextValue}>
        {children}
      </UserContext.Provider>
    );

    const { getByTestId } = render(<Leaderboard />, {
      wrapper,
    });

    await act(async () => await sleep(500));
    expect(getByTestId("error-rank")).toBeVisible();
  });

  it("Should not render the Leaderboard page if the user is not authenticated", async () => {
    const router = { push: jest.fn(), pathname: "/dashboard/leaderboard" };
    jest.spyOn(nextRouter, "useRouter").mockReturnValue(router);

    UserContextValue.isAuthenticated = false;

    const wrapper: FC = ({ children }) => (
      <UserContext.Provider value={UserContextValue}>
        {children}
      </UserContext.Provider>
    );

    const { getByTestId } = render(<Leaderboard />, { wrapper });
    await act(async () => await sleep(500));

    expect(getByTestId("loading")).toBeVisible();
  });

  it("Should not render the page Leaderboard if is loading", async () => {
    const router = { push: jest.fn(), pathname: "/dashboard/leaderboard" };
    jest.spyOn(nextRouter, "useRouter").mockReturnValue(router);

    UserContextValue.loading = true;

    const wrapper: FC = ({ children }) => (
      <UserContext.Provider value={UserContextValue}>
        {children}
      </UserContext.Provider>
    );

    const { getByTestId } = render(<Leaderboard />, { wrapper });

    await act(async () => await sleep(500));

    expect(getByTestId("loading")).toBeVisible();
  });
});
