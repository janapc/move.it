import { FC } from "react";
import { render, fireEvent } from "@testing-library/react";

import { Countdown } from "../../../src/components/Countdown";

import { CountdownContext } from "../../../src/contexts/CountdownContext";

const CountdownContextValue = {
  minutes: Math.floor(60 / 60),
  seconds: 60 % 60,
  hasFinished: false,
  isActive: false,
  startCountdown: jest.fn(),
  resetCountdown: jest.fn()
};

describe("Countdown Component", () => {
  it("Should show this button when the cycle to initial", () => {
    const wrapper: FC = ({ children }) => (
      <CountdownContext.Provider value={CountdownContextValue}>
        {children}
      </CountdownContext.Provider>
    );

    const { getByTestId } = render(<Countdown />, { wrapper });

    expect(getByTestId("time")).toHaveTextContent("01:00");
    expect(getByTestId("btn-initial")).toBeVisible();
    expect(getByTestId("btn-initial")).toHaveTextContent("Iniciar um ciclo");

    fireEvent.click(getByTestId("btn-initial"));

    expect(CountdownContextValue.startCountdown).toBeCalled();
  });

  it("Should show this button when the cycle to leave", () => {
    CountdownContextValue.isActive = true;

    const wrapper: FC = ({ children }) => (
      <CountdownContext.Provider value={CountdownContextValue}>
        {children}
      </CountdownContext.Provider>
    );

    const { getByTestId } = render(<Countdown />, { wrapper });

    expect(getByTestId("time")).toHaveTextContent("01:00");
    expect(getByTestId("btn-leave")).toBeVisible();
    expect(getByTestId("btn-leave")).toHaveTextContent("Abandonar ciclo");

    fireEvent.click(getByTestId("btn-leave"));

    expect(CountdownContextValue.resetCountdown).toBeCalled();
  });

  it("Should show this button when the cycle to finish", () => {
    CountdownContextValue.isActive = false;
    CountdownContextValue.hasFinished = true;

    const wrapper: FC = ({ children }) => (
      <CountdownContext.Provider value={CountdownContextValue}>
        {children}
      </CountdownContext.Provider>
    );

    const { getByTestId } = render(<Countdown />, { wrapper });

    expect(getByTestId("time")).toHaveTextContent("01:00");
    expect(getByTestId("btn-finish")).toBeDisabled();
    expect(getByTestId("btn-finish")).toHaveTextContent("Ciclo encerrado");
  });
});
