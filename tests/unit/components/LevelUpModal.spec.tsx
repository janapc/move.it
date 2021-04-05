import { FC } from "react";
import { fireEvent, render, waitFor } from "@testing-library/react";

import { LevelUpModal } from "../../../src/components/LevelUpModal";

import { ChallengesContext } from "../../../src/contexts/ChallengesContext";
import * as cryptoTwitter from "../../../src/utils/crypto";

global.Notification = ({
  requestPermission: jest.fn(),
  permission: "granted",
} as unknown) as jest.Mocked<typeof Notification>;

const ChallengesContextValue = {
  level: 2,
  currentExperience: 0,
  challengesCompleted: 0,
  expirenceTotal: 0,
  activeChallenge: null,
  expirenceToNextLevel: Math.pow((2 + 1) * 4, 2),
  startNewChallenge: jest.fn(),
  resetChallenge: jest.fn(),
  completeChallenge: jest.fn(),
  closeLevelUpModal: jest.fn(),
};

describe("LevelUpModal Component", () => {
  it("Should render the component of LevelUpModal correctly", () => {
    const wrapper: FC = ({ children }) => (
      <ChallengesContext.Provider value={ChallengesContextValue}>
        {children}
      </ChallengesContext.Provider>
    );

    const { getByTestId, getByText } = render(<LevelUpModal />, { wrapper });

    expect(getByText("Parabéns")).toBeTruthy();
    expect(getByText("Você alcançou um novo level.")).toBeTruthy();
    expect(getByTestId("level")).toHaveTextContent("2");
    expect(getByTestId("btn-close-modal")).toBeTruthy();
    expect(getByTestId("btn-twitter-modal")).toBeTruthy();
  });

  it("Should close the modal", () => {
    const wrapper: FC = ({ children }) => (
      <ChallengesContext.Provider value={ChallengesContextValue}>
        {children}
      </ChallengesContext.Provider>
    );

    const { getByTestId } = render(<LevelUpModal />, { wrapper });

    expect(getByTestId("btn-close-modal")).toBeTruthy();

    fireEvent.click(getByTestId("btn-close-modal"));
    expect(ChallengesContextValue.closeLevelUpModal).toBeCalled();
  });

  it("Should not share on Twitter", async () => {
    window.alert = jest.fn();
    jest.spyOn(cryptoTwitter, "encrypt").mockImplementation(() => {
      throw new Error("Has error");
    });

    const wrapper: FC = ({ children }) => (
      <ChallengesContext.Provider value={ChallengesContextValue}>
        {children}
      </ChallengesContext.Provider>
    );

    const { getByTestId } = render(<LevelUpModal />, { wrapper });

    expect(getByTestId("btn-twitter-modal")).toBeTruthy();

    fireEvent.click(getByTestId("btn-twitter-modal"));

    await waitFor(() => {
      expect(cryptoTwitter.encrypt).toBeCalled();
      expect(cryptoTwitter.encrypt).toThrowError("Has error");
      expect(window.alert).toBeCalled();
    });
  });

  it("Should share on Twitter", async () => {
    window.open = jest.fn();
    jest.spyOn(cryptoTwitter, "encrypt").mockImplementation(() => {
      return ["asdas", "qweqwds", "qweqssd"];
    });

    const wrapper: FC = ({ children }) => (
      <ChallengesContext.Provider value={ChallengesContextValue}>
        {children}
      </ChallengesContext.Provider>
    );

    const { getByTestId } = render(<LevelUpModal />, { wrapper });

    expect(getByTestId("btn-twitter-modal")).toBeTruthy();

    fireEvent.click(getByTestId("btn-twitter-modal"));

    await waitFor(() => {
      expect(cryptoTwitter.encrypt).toBeCalled();
      expect(cryptoTwitter.encrypt).toReturnWith([
        "asdas",
        "qweqwds",
        "qweqssd",
      ]);
      expect(window.open).toBeCalled();
    });
  });
});
