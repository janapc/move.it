import { FC } from "react";
import { render } from "@testing-library/react";

import { CompletedChallenges } from "../../../src/components/CompletedChallenges";

import { ChallengesContext } from "../../../src/contexts/ChallengesContext";

global.Notification = ({
  requestPermission: jest.fn(),
  permission: "granted"
} as unknown) as jest.Mocked<typeof Notification>;

const ChallengesContextValue = {
  level: 2,
  currentExperience: 0,
  challengesCompleted: 3,
  activeChallenge: null,
  expirenceTotal: 0,
  expirenceToNextLevel: Math.pow((2 + 1) * 4, 2),
  startNewChallenge: jest.fn(),
  resetChallenge: jest.fn(),
  completeChallenge: jest.fn(),
  closeLevelUpModal: jest.fn()
};

describe("CompletedChallenges Component", () => {
  it("Should show completed challenges", () => {
    const wrapper: FC = ({ children }) => (
      <ChallengesContext.Provider value={ChallengesContextValue}>
        {children}
      </ChallengesContext.Provider>
    );

    const { getByText } = render(<CompletedChallenges />, { wrapper });

    expect(getByText("Desafios completos")).toBeTruthy();
    expect(getByText(`${ChallengesContextValue.challengesCompleted}`)).toBeTruthy();
  });
});
