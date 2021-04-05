import { FC } from "react";
import { render } from "@testing-library/react";

import { Profile } from "../../../src/components/Profile";

import { ChallengesContext } from "../../../src/contexts/ChallengesContext";
import { UserContext } from "../../../src/contexts/UserContext";

global.Notification = ({
  requestPermission: jest.fn(),
  permission: "granted"
} as unknown) as jest.Mocked<typeof Notification>;

const ChallengesContextValue = {
  level: 2,
  currentExperience: 0,
  challengesCompleted: 0,
  activeChallenge: null,
  expirenceTotal: 0,
  expirenceToNextLevel: Math.pow((2 + 1) * 4, 2),
  startNewChallenge: jest.fn(),
  resetChallenge: jest.fn(),
  completeChallenge: jest.fn(),
  closeLevelUpModal: jest.fn()
};

const UserContextValue = {
  user: { token: "123", username: "banana", avatar: "" },
  isAuthenticated: true,
  saveDataOfUser: jest.fn(),
  loading: false
};

describe("Profile Component", () => {
  it("Should render the component of Profile pass a level to user", () => {
    const wrapper: FC = ({ children }) => (
      <ChallengesContext.Provider value={ChallengesContextValue}>
       <UserContext.Provider value={UserContextValue}>
          {children}
        </UserContext.Provider>
      </ChallengesContext.Provider>
    );

    const { getByTestId, container } = render(<Profile />, { wrapper });

    expect(container.children.length).toEqual(1);
    expect(getByTestId("name")).toHaveTextContent(UserContextValue.user.username);
    expect(getByTestId("level")).toHaveTextContent(`Level ${ChallengesContextValue.level}`);
  });

  it("Should not render the component of Profile", () => {
    UserContextValue.loading = true;

    const wrapper: FC = ({ children }) => (
      <ChallengesContext.Provider value={ChallengesContextValue}>
       <UserContext.Provider value={UserContextValue}>
          {children}
        </UserContext.Provider>
      </ChallengesContext.Provider>
    );

    const { container } = render(<Profile />, { wrapper });
    expect(container.children.length).toEqual(0);
  });
});
