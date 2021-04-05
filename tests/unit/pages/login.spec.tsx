import { fireEvent, render, act } from "@testing-library/react";
import axios from "axios";
import * as nextRouter from "next/router";
import { FC } from "react";

import { UserContext } from "../../../src/contexts/UserContext";

import Login from "../../../src/pages/login";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

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

const UserContextValue = {
  user: null,
  isAuthenticated: false,
  saveDataOfUser: jest.fn(),
  loading: true,
};

describe("Login", () => {
  it("Should make the login of user, passing the data correctly", async () => {
    mockedAxios.get.mockImplementation(() => {
      return Promise.resolve({
        data: {
          login: "banana",
          id: "123",
          node_id: "ask2",
          avatar_url: "",
        },
      });
    });
    mockedAxios.post
      .mockImplementationOnce(() => {
        return Promise.resolve({
          data: {
            token: "banana123",
          },
        });
      })
      .mockImplementationOnce(() => {
        return Promise.resolve(true);
      });

    const router = { push: jest.fn() };
    const spyRouter = jest
      .spyOn(nextRouter, "useRouter")
      .mockReturnValue(router);
    
    const spySessionStorage = jest
      .spyOn(sessionStorageMock, "setItem");

    const wrapper: FC = ({ children }) => (
      <UserContext.Provider value={UserContextValue}>
        {children}
      </UserContext.Provider>
    );

    const { getByTestId } = render(<Login />, { wrapper });

    const btnLogin = getByTestId("btn-login");
    const inputUsername = getByTestId("input-username");

    expect(btnLogin).toBeDisabled();

    fireEvent.change(inputUsername, { target: { value: "banana123" } });

    expect(inputUsername).toHaveValue("banana123");
    expect(btnLogin).toBeVisible();

    await act(async () => {
      await fireEvent.click(btnLogin);
    });

    expect(mockedAxios.get).toBeCalledTimes(1);
    expect(mockedAxios.post).toBeCalledTimes(2);
    expect(UserContextValue.saveDataOfUser).toBeCalledTimes(1);
    expect(spySessionStorage).toBeCalled();
    expect(spyRouter).toBeCalled();
  });

  it("Should not make the login of the user, passing the data incorrectly", async () => {
    mockedAxios.get.mockImplementation(() => {
      return Promise.reject(Error('User not found!'));
    });

    const wrapper: FC = ({ children }) => (
      <UserContext.Provider value={UserContextValue}>
        {children}
      </UserContext.Provider>
    );

    const { getByTestId } = render(<Login />, { wrapper });

    const btnLogin = getByTestId("btn-login");
    const inputUsername = getByTestId("input-username");

    expect(btnLogin).toBeDisabled();

    fireEvent.change(inputUsername, { target: { value: "test123" } });

    expect(inputUsername).toHaveValue("test123");
    expect(btnLogin).toBeVisible();
    
    await act(async () => {
      await fireEvent.click(btnLogin);
    });
    
    expect(mockedAxios.get).rejects.toThrowError('User not found!');
    expect(getByTestId("has-error")).toBeVisible();
  });
});
