import { render } from "@testing-library/react";

import { Profile } from "../../../src/components/Profile";

import { ChallengesContext } from "../../../src/contexts/ChallengesContext";

global.Notification = ({
  requestPermission: jest.fn(),
  permission: "granted"
} as unknown) as jest.Mocked<typeof Notification>;

const ChallengesContextValue = {
  level: 2,
  currentExperience: 0,
  challengesCompleted: 0,
  activeChallenge: null,
  expirenceToNextLevel: Math.pow((2 + 1) * 4, 2),
  startNewChallenge: jest.fn(),
  resetChallenge: jest.fn(),
  completeChallenge: jest.fn(),
  closeLevelUpModal: jest.fn()
};

describe("Profile Component", () => {
  it("Should render the component of Profile pass a level to user", () => {
    const wrapper = ({ children }) => (
      <ChallengesContext.Provider value={ChallengesContextValue}>
        {children}
      </ChallengesContext.Provider>
    );

    const { getByTestId } = render(<Profile />, { wrapper });

    expect(getByTestId("name")).toHaveTextContent("Janaina Pedrina");
    expect(getByTestId("level")).toHaveTextContent(`Level ${ChallengesContextValue.level}`);
  });
});
