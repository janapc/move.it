import { useContext } from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import axios from "axios";
import Cookies from "js-cookie";

import {
  ChallengesProvider,
  ChallengesContext
} from "../../../src/contexts/ChallengesContext";

import {
  UserContext
} from "../../../src/contexts/UserContext";

global.Notification = ({
  requestPermission: jest.fn(),
  permission: "granted"
} as unknown) as jest.Mocked<typeof Notification>;

jest.mock("js-cookie")
jest.mock("axios")

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("ChallengesContext", () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });
  it("Should return the values initial", () => {
    mockedAxios.post.mockImplementation(() => {
      return Promise.resolve(true)
    });

    const spyCookie = jest.spyOn(Cookies, "set");

    const wrapper = ({ children }: any) => (
      <ChallengesProvider
        level={0}
        currentExperience={0}
        challengesCompleted={0}
        expirenceTotal={0}
      >
        {children}

      </ChallengesProvider>
    );

    const userContext = renderHook(() => useContext(UserContext));
    userContext.result.current.user = { token: "banana123", username: "banana", avatar: "" };

    const { result } = renderHook(() => useContext(ChallengesContext), {
      wrapper
    });

    expect(spyCookie).toHaveBeenCalledTimes(4);
    expect(mockedAxios.post).toHaveBeenCalledTimes(1);

    expect(result.current).toEqual({
      level: 0,
      currentExperience: 0,
      challengesCompleted: 0,
      activeChallenge: null,
      expirenceTotal: 0,
      expirenceToNextLevel: 16,
      startNewChallenge: result.current.startNewChallenge,
      resetChallenge: result.current.resetChallenge,
      completeChallenge: result.current.completeChallenge,
      closeLevelUpModal: result.current.closeLevelUpModal
    });
  });

  it("Should start a new challenge", () => {
    mockedAxios.post.mockImplementation(() => {
      return Promise.resolve(true)
    });

    const spyCookie = jest.spyOn(Cookies, "set");

    const wrapper = ({ children }: any) => (
      <ChallengesProvider
        level={0}
        currentExperience={0}
        challengesCompleted={0}
        expirenceTotal={0}
      >
        {children}
      </ChallengesProvider>
    );

    const userContext = renderHook(() => useContext(UserContext));
    userContext.result.current.user = { token: "banana123", username: "banana", avatar: "" };

    const { result } = renderHook(() => useContext(ChallengesContext), {
      wrapper
    });

    expect(spyCookie).toHaveBeenCalledTimes(4);
    expect(mockedAxios.post).toHaveBeenCalledTimes(1);

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
    expect(result.current.activeChallenge).toEqual({
      type: "body",
      description: "testing...",
      amount: 150
    });
  });

  it("Should reset the challenge", () => {
    mockedAxios.post.mockImplementation(() => {
      return Promise.resolve(true)
    });

    const spyCookie = jest.spyOn(Cookies, "set");

    const wrapper = ({ children }: any) => (
      <ChallengesProvider
        level={0}
        currentExperience={0}
        challengesCompleted={0}
        expirenceTotal={0}
      >
        {children}
      </ChallengesProvider>
    );

    const userContext = renderHook(() => useContext(UserContext));
    userContext.result.current.user = { token: "banana123", username: "banana", avatar: "" };

    const { result } = renderHook(() => useContext(ChallengesContext), {
      wrapper
    });

    expect(spyCookie).toHaveBeenCalledTimes(4);
    expect(mockedAxios.post).toHaveBeenCalledTimes(1);

    result.current.activeChallenge = {
      type: "body",
      description: "testing...",
      amount: 150
    };

    expect(result.current.activeChallenge).toEqual({
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
    mockedAxios.post.mockImplementation(() => {
      return Promise.resolve(true)
    });

    const spyCookie = jest.spyOn(Cookies, "set");

    const wrapper = ({ children }: any) => (
      <ChallengesProvider
        level={0}
        currentExperience={0}
        challengesCompleted={0}
        expirenceTotal={0}
      >
        {children}
      </ChallengesProvider>
    );

    const userContext = renderHook(() => useContext(UserContext));
    userContext.result.current.user = { token: "banana123", username: "banana", avatar: "" };

    const { result } = renderHook(() => useContext(ChallengesContext), {
      wrapper
    });

    expect(spyCookie).toHaveBeenCalledTimes(4);
    expect(mockedAxios.post).toHaveBeenCalledTimes(1);

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
      result.current.expirenceTotal =
        result.current.expirenceTotal + result.current.activeChallenge.amount;
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
    expect(result.current.expirenceTotal).toEqual(150);
  });

  it("Should close the modal of level up", () => {
    mockedAxios.post.mockImplementation(() => {
      return Promise.resolve(true)
    });

    const spyCookie = jest.spyOn(Cookies, "set");

    const wrapper = ({ children }: any) => (
      <ChallengesProvider
        level={0}
        currentExperience={0}
        challengesCompleted={0}
        expirenceTotal={0}
      >
        {children}
      </ChallengesProvider>
    );

    const userContext = renderHook(() => useContext(UserContext));
    userContext.result.current.user = { token: "banana123", username: "banana", avatar: "" };

    const { result } = renderHook(() => useContext(ChallengesContext), {
      wrapper
    });

    expect(spyCookie).toHaveBeenCalledTimes(4);
    expect(mockedAxios.post).toHaveBeenCalledTimes(1);

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
