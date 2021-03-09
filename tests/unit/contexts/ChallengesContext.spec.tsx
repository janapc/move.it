import { useContext } from "react";
import { renderHook, act } from "@testing-library/react-hooks";

import {
  ChallengesProvider,
  ChallengesContext
} from "../../../src/contexts/ChallengesContext";

global.Notification = ({
  requestPermission: jest.fn(),
  permission: "granted"
} as unknown) as jest.Mocked<typeof Notification>;

describe("ChallengesContext", () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });
  it("Should return the values initial", () => {
    const wrapper = ({ children }: any) => (
      <ChallengesProvider
        level={0}
        currentExperience={0}
        challengesCompleted={0}
      >
        {children}
      </ChallengesProvider>
    );

    const { result } = renderHook(() => useContext(ChallengesContext), {
      wrapper
    });

    expect(result.current).toMatchObject({
      level: 0,
      currentExperience: 0,
      challengesCompleted: 0,
      activeChallenge: null,
      expirenceToNextLevel: 16,
      startNewChallenge: result.current.startNewChallenge,
      resetChallenge: result.current.resetChallenge,
      completeChallenge: result.current.completeChallenge,
      closeLevelUpModal: result.current.closeLevelUpModal
    });
  });

  it("Should start a new challenge", () => {
    const wrapper = ({ children }: any) => (
      <ChallengesProvider
        level={0}
        currentExperience={0}
        challengesCompleted={0}
      >
        {children}
      </ChallengesProvider>
    );

    const { result } = renderHook(() => useContext(ChallengesContext), {
      wrapper
    });

    jest.spyOn(result.current, "startNewChallenge").mockImplementation(() => {
      result.current.activeChallenge = {
        type: "body",
        description: "testing...",
        amount: 150
      };
    });

    expect(result.current.activeChallenge).toBeNull();

    act(() => {
      result.current.startNewChallenge();
    });

    expect(result.current.activeChallenge).toBeTruthy();
    expect(result.current.activeChallenge).toMatchObject({
      type: "body",
      description: "testing...",
      amount: 150
    });
  });

  it("Should reset the challenge", () => {
    const wrapper = ({ children }: any) => (
      <ChallengesProvider
        level={0}
        currentExperience={0}
        challengesCompleted={0}
      >
        {children}
      </ChallengesProvider>
    );

    const { result } = renderHook(() => useContext(ChallengesContext), {
      wrapper
    });

    result.current.activeChallenge = {
      type: "body",
      description: "testing...",
      amount: 150
    };

    expect(result.current.activeChallenge).toMatchObject({
      type: "body",
      description: "testing...",
      amount: 150
    });

    jest.spyOn(result.current, "resetChallenge").mockImplementation(() => {
      result.current.activeChallenge = null;
    });

    act(() => {
      result.current.resetChallenge();
    });

    expect(result.current.activeChallenge).toBeNull();
  });

  it("Should complete the challenge", () => {
    const wrapper = ({ children }: any) => (
      <ChallengesProvider
        level={0}
        currentExperience={0}
        challengesCompleted={0}
      >
        {children}
      </ChallengesProvider>
    );

    const { result } = renderHook(() => useContext(ChallengesContext), {
      wrapper
    });

    result.current.activeChallenge = {
      type: "body",
      description: "testing...",
      amount: 150
    };

    jest.spyOn(result.current, "completeChallenge").mockImplementation(() => {
      let finalExperience =
        result.current.currentExperience +
        result.current.activeChallenge.amount;
      if (finalExperience >= result.current.expirenceToNextLevel) {
        finalExperience = finalExperience - result.current.expirenceToNextLevel;
        result.current.level = result.current.level + 1;
      }

      result.current.currentExperience = result.current.level + 1;
      result.current.activeChallenge = null;
      result.current.challengesCompleted =
        result.current.challengesCompleted + 1;
    });

    act(() => {
      result.current.completeChallenge();
    });

    expect(result.current.level).toEqual(1);
    expect(result.current.currentExperience).toEqual(2);
    expect(result.current.activeChallenge).toEqual(null);
    expect(result.current.challengesCompleted).toEqual(1);
  });

  it("Should close the modal of level up", () => {
    const wrapper = ({ children }: any) => (
      <ChallengesProvider
        level={0}
        currentExperience={0}
        challengesCompleted={0}
      >
        {children}
      </ChallengesProvider>
    );

    const { result } = renderHook(() => useContext(ChallengesContext), {
      wrapper
    });
    const closeLevelUpModalSpy = jest.spyOn(
      result.current,
      "closeLevelUpModal"
    );

    act(() => {
      result.current.closeLevelUpModal();
    });

    expect(closeLevelUpModalSpy).toBeCalled();
  });
});
