import { useContext } from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import axios from "axios";

import { UserContext, UserProvider } from "../../../src/contexts/UserContext";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const sessionStorageMock = (() => {
  let store = {};

  return {
    getItem(key) {
      return store[key] || null;
    },
    setItem(key, value) {
      store[key] = value.toString();
    },
    removeItem(key) {
      delete store[key];
    },
    clear() {
      store = {};
    },
  };
})();

Object.defineProperty(window, "sessionStorage", {
  value: sessionStorageMock,
});

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("UserContext", () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });
  it("Should return the values initial without authentication of user", async () => {
    const wrapper = ({ children }: any) => (
      <UserProvider>{children}</UserProvider>
    );

    const { result } = renderHook(() => useContext(UserContext), {
      wrapper,
    });

    await act(async () => await sleep(500));

    expect(result.current).toEqual({
      user: null,
      isAuthenticated: false,
      saveDataOfUser: result.current.saveDataOfUser,
      loading: false,
    });
  });

  it("Should return the values initial with authentication of user", async () => {
    sessionStorageMock.setItem(
      "user",
      '{"username": "banana", "avatar": "", "token": "banana123"}'
    );
    mockedAxios.get.mockImplementation(() => {
      return Promise.resolve({
        data: {
          success: true,
        },
      });
    });

    const wrapper = ({ children }: any) => (
      <UserProvider>{children}</UserProvider>
    );

    let { result } = renderHook(() => useContext(UserContext), {
      wrapper,
    });

    expect(result.current.loading).toBeTruthy();
    expect(result.current.isAuthenticated).toBeFalsy();

    await act(async () => await sleep(500));

    expect(result.current).toEqual({
      user: { username: "banana", avatar: "", token: "banana123" },
      isAuthenticated: true,
      saveDataOfUser: result.current.saveDataOfUser,
      loading: false,
    });
  });

  it("Should save the data of the user and make the authentication", async () => {
    mockedAxios.get.mockImplementation(() => {
      return Promise.resolve({
        data: {
          success: true,
        },
      });
    });

    const wrapper = ({ children }: any) => (
      <UserProvider>{children}</UserProvider>
    );

    let { result } = renderHook(() => useContext(UserContext), {
      wrapper,
    });

    expect(result.current.loading).toBeTruthy();
    expect(result.current.isAuthenticated).toBeFalsy();

    await act(async () => await sleep(500));

    const saveDataOfUserSpy = jest.spyOn(result.current, "saveDataOfUser");

    await act(async () => {
      await result.current.saveDataOfUser({
        username: "banana1",
        token: "banana1234",
        avatar: "",
      });
    });

    expect(result.current).toEqual({
      user: { username: "banana1", avatar: "", token: "banana1234" },
      isAuthenticated: true,
      saveDataOfUser: result.current.saveDataOfUser,
      loading: false,
    });

    expect(saveDataOfUserSpy).toBeCalled();
  });
});
