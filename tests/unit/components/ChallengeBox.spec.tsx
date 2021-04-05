import { FC } from "react";
import { render, fireEvent } from "@testing-library/react";

import { ChallengeBox } from "../../../src/components/ChallengeBox";

import { ChallengesContext, ChallengesContextData } from "../../../src/contexts/ChallengesContext";
import { CountdownContext } from "../../../src/contexts/CountdownContext";

global.Notification = ({
  requestPermission: jest.fn(),
  permission: "granted"
} as unknown) as jest.Mocked<typeof Notification>;

const ChallengesContextValue: ChallengesContextData = {
  level: 2,
  currentExperience: 0,
  challengesCompleted: 3,
  activeChallenge: {
    type: "body",
    description: "Walk a little",
    amount: 150
  },
  expirenceTotal: 0,
  expirenceToNextLevel: Math.pow((2 + 1) * 4, 2),
  startNewChallenge: jest.fn(),
  resetChallenge: jest.fn(),
  completeChallenge: jest.fn(),
  closeLevelUpModal: jest.fn()
};

const CountdownContextValue = {
  minutes: Math.floor(60 / 60),
  seconds: 60 % 60,
  hasFinished: false,
  isActive: false,
  startCountdown: jest.fn(),
  resetCountdown: jest.fn()
};

describe("ChallengeBox Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });
  it("Should show the challenge and complete it", () => {
    const wrapper: FC = ({ children }) => (
      <ChallengesContext.Provider value={ChallengesContextValue}>
        <CountdownContext.Provider value={CountdownContextValue}>
          {children}
        </CountdownContext.Provider>
      </ChallengesContext.Provider>
    );

    const { getByTestId } = render(<ChallengeBox />, { wrapper });

    expect(getByTestId("header")).toHaveTextContent(
      `Ganhe ${ChallengesContextValue.activeChallenge.amount} xp`
    );
    expect(getByTestId("main")).toHaveTextContent(
      ChallengesContextValue.activeChallenge.description
    );

    fireEvent.click(getByTestId("btn-succeeded"));

    expect(ChallengesContextValue.completeChallenge).toBeCalled();
    expect(CountdownContextValue.resetCountdown).toBeCalled();
  });

  it("Should show the challenge and complete it", () => {
    const wrapper: FC = ({ children }) => (
      <ChallengesContext.Provider value={ChallengesContextValue}>
        <CountdownContext.Provider value={CountdownContextValue}>
          {children}
        </CountdownContext.Provider>
      </ChallengesContext.Provider>
    );

    const { getByTestId } = render(<ChallengeBox />, { wrapper });

    expect(getByTestId("header")).toHaveTextContent(
      `Ganhe ${ChallengesContextValue.activeChallenge.amount} xp`
    );
    expect(getByTestId("main")).toHaveTextContent(
      ChallengesContextValue.activeChallenge.description
    );
    expect(getByTestId("img-main")).toHaveAttribute(
      "src",
      `/icons/${ChallengesContextValue.activeChallenge.type}.svg`
    );

    fireEvent.click(getByTestId("btn-failed"));

    expect(ChallengesContextValue.resetChallenge).toBeCalled();
    expect(CountdownContextValue.resetCountdown).toBeCalled();
  });
});
