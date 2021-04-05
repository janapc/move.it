import { FC } from "react";
import { render } from "@testing-library/react";

import { ExperienceBar } from "../../../src/components/ExperienceBar";

import { ChallengesContext } from "../../../src/contexts/ChallengesContext";

global.Notification = ({
  requestPermission: jest.fn(),
  permission: "granted"
} as unknown) as jest.Mocked<typeof Notification>;

const ChallengesContextValue = {
  level: 2,
  currentExperience: 2,
  challengesCompleted: 0,
  activeChallenge: null,
  expirenceTotal: 0,
  expirenceToNextLevel: Math.pow((2 + 1) * 4, 2),
  startNewChallenge: jest.fn(),
  resetChallenge: jest.fn(),
  completeChallenge: jest.fn(),
  closeLevelUpModal: jest.fn()
};

describe("ExperienceBar Component", () => {
  it("Should render the component of ExperienceBar correctly", () => {
    const wrapper: FC = ({ children }) => (
      <ChallengesContext.Provider value={ChallengesContextValue}>
        {children}
      </ChallengesContext.Provider>
    );

    const { getByTestId } = render(<ExperienceBar />, { wrapper });

    const percentToNextLevel = Math.round(ChallengesContextValue.currentExperience * 100) / ChallengesContextValue.expirenceToNextLevel;

    expect(getByTestId("expirence-to-next-level")).toHaveTextContent(String(ChallengesContextValue.expirenceToNextLevel));
    expect(getByTestId("bar-left-percent")).toHaveTextContent(String(ChallengesContextValue.currentExperience));

    expect(getByTestId("bar-width-percent").style.width).toBe(`${percentToNextLevel}%`);
    expect(getByTestId("bar-left-percent").style.left).toBe(`${percentToNextLevel}%`);
  });
});
