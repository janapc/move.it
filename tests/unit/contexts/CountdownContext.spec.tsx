import { useContext } from "react";
import { renderHook, act, cleanup } from "@testing-library/react-hooks";

import {
  CountdownProvider,
  CountdownContext
} from "../../../src/contexts/CountdownContext";

afterEach(cleanup);

describe("CountdownContext", () => {
  it("Should return the values initial", () => {
    const wrapper = ({ children }: any) => (
      <CountdownProvider>{children}</CountdownProvider>
    );

    const { result } = renderHook(() => useContext(CountdownContext), {
      wrapper
    });

    expect(result.current).toMatchObject({
      minutes: 0,
      seconds: 6,
      hasFinished: false,
      isActive: false,
      startCountdown: result.current.startCountdown,
      resetCountdown: result.current.resetCountdown
    });
  });

  it("Should start countdown", () => {
    const wrapper = ({ children }: any) => (
      <CountdownProvider>{children}</CountdownProvider>
    );
    const { result } = renderHook(() => useContext(CountdownContext), {
      wrapper
    });

    act(() => {
      result.current.startCountdown();
    });

    expect(result.current.isActive).toBeTruthy();
  });
  it("Should reset countdown", () => {
    const wrapper = ({ children }: any) => (
      <CountdownProvider>{children}</CountdownProvider>
    );
    const { result } = renderHook(() => useContext(CountdownContext), {
      wrapper
    });

    act(() => {
      result.current.resetCountdown();
    });

    expect(result.current.isActive).toBeFalsy();
    expect(result.current.hasFinished).toBeFalsy();
  });
});
