import { render } from "@testing-library/react";
import { FC } from "react";
import * as nextRouter from "next/router";

import { UserContext } from "../../../../src/contexts/UserContext";
import {
  ChallengesContext,
  ChallengesContextData,
} from "../../../../src/contexts/ChallengesContext";

import Home, { getServerSideProps } from "../../../../src/pages/dashboard/home";

const UserContextValue = {
  user: { username: "banana", avatar: "", token: "banana123" },
  isAuthenticated: true,
  saveDataOfUser: jest.fn(),
  loading: false,
};

const ChallengesContextValue: ChallengesContextData = {
  level: 1,
  currentExperience: 20,
  challengesCompleted: 2,
  expirenceTotal: 200,
  activeChallenge: {
    type: "body",
    description: "testing...",
    amount: 20,
  },
  expirenceToNextLevel: 20,
  startNewChallenge: jest.fn(),
  resetChallenge: jest.fn(),
  completeChallenge: jest.fn(),
  closeLevelUpModal: jest.fn(),
};

const router = { push: jest.fn(), pathname: "/dashboard/home" };
jest.spyOn(nextRouter, "useRouter").mockReturnValue(router);

global.Notification = ({
  requestPermission: jest.fn(),
  permission: "granted",
} as unknown) as jest.Mocked<typeof Notification>;

describe("Home", () => {
  it("Should render the page Home correctly", async () => {
    const response = await getServerSideProps({
      req: {
        cookies: {
          level: "1",
          currentExperience: "20",
          challengesCompleted: "2",
          expirenceTotal: "200",
        },
      },
    });

    const wrapper: FC = ({ children }) => (
      <UserContext.Provider value={UserContextValue}>
        <ChallengesContext.Provider value={ChallengesContextValue}>
          {children}
        </ChallengesContext.Provider>
      </UserContext.Provider>
    );

    const { getByTestId } = render(<Home {...response.props} />, { wrapper });

    expect(getByTestId("home")).toBeVisible();
  });

  it("Should not render the home page if the user is not authenticated", async () => {
    UserContextValue.isAuthenticated = false
    const response = await getServerSideProps({
      req: {
        cookies: {
          level: "1",
          currentExperience: "20",
          challengesCompleted: "2",
          expirenceTotal: "200",
        },
      },
    });

    const wrapper: FC = ({ children }) => (
      <UserContext.Provider value={UserContextValue}>
        <ChallengesContext.Provider value={ChallengesContextValue}>
          {children}
        </ChallengesContext.Provider>
      </UserContext.Provider>
    );

    const { getByTestId } = render(<Home {...response.props} />, { wrapper });

    expect(getByTestId("loading")).toBeVisible();
  });

  it("Should not render the page Home if is loading", async () => {
    UserContextValue.loading = true;

    const response = await getServerSideProps({
      req: {
        cookies: {
          level: "1",
          currentExperience: "20",
          challengesCompleted: "2",
          expirenceTotal: "200",
        },
      },
    });

    const wrapper: FC = ({ children }) => (
      <UserContext.Provider value={UserContextValue}>
        <ChallengesContext.Provider value={ChallengesContextValue}>
          {children}
        </ChallengesContext.Provider>
      </UserContext.Provider>
    );

    const { getByTestId } = render(<Home {...response.props} />, { wrapper });

    expect(getByTestId("loading")).toBeVisible();
  });
});
