import { fireEvent, render } from "@testing-library/react";

import { LevelUpModal } from "../../../src/components/LevelUpModal";

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

describe("LevelUpModal Component", () => {
  it("Should render the component of LevelUpModal correctly", () => {
    const wrapper = ({ children }) => (
      <ChallengesContext.Provider value={ChallengesContextValue}>
        {children}
      </ChallengesContext.Provider>
    );

    const { getByTestId, getByText } = render(<LevelUpModal />, { wrapper });

    expect(getByText("Parabéns")).toBeTruthy();
    expect(getByText("Você alcançou um novo level.")).toBeTruthy();
    expect(getByTestId("level")).toHaveTextContent("2");
    expect(getByTestId("btn-close-modal")).toBeTruthy();
  });

  it("Should close the modal", () => {
    const wrapper = ({ children }) => (
      <ChallengesContext.Provider value={ChallengesContextValue}>
        {children}
      </ChallengesContext.Provider>
    );

    const { getByTestId } = render(<LevelUpModal />, { wrapper });

    expect(getByTestId("btn-close-modal")).toBeTruthy();

    fireEvent.click(getByTestId("btn-close-modal"));
    expect(ChallengesContextValue.closeLevelUpModal).toBeCalled();
  });
});
