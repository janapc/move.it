import { useContext, useState } from "react";

import { CountdownContext } from "../contexts/CountdownContext";

import styles from "../styles/components/Countdown.module.css";

export function Countdown () {
  const {
    minutes,
    seconds,
    hasFinished,
    isActive,
    startCountdown,
    resetCountdown
  } = useContext(CountdownContext);

  const [closeHover, setCloseHover] = useState(false);

  const [minuteLeft, minuteRight] = String(minutes).padStart(2, "0").split("");
  const [secondsLeft, secondsRight] = String(seconds)
    .padStart(2, "0")
    .split("");

  return (
    <div>
      <div data-testid="time" className={styles.countdownContainer}>
        <div>
          <span>{minuteLeft}</span>
          <span>{minuteRight}</span>
        </div>
        <span>:</span>
        <div>
          <span>{secondsLeft}</span>
          <span>{secondsRight}</span>
        </div>
      </div>

      {hasFinished
        ? (
        <button
          data-testid="btn-finish"
          disabled
          className={`${styles.countdownButton} ${styles.countdownButtonFinished}`}
        >
          Ciclo encerrado <img src="/icons/check-circle.svg" />
        </button>
          )
        : (
        <>
          {isActive
            ? (
            <button
              data-testid="btn-leave"
              onClick={resetCountdown}
              type="button"
              onMouseEnter={() => setCloseHover(true)}
              onMouseLeave={() => setCloseHover(false)}
              className={`${styles.countdownButton} ${styles.countdownButtonActive}`}
            >
              Abandonar ciclo
              <img
                src={closeHover ? "/icons/close-hover.svg" : "/icons/close.svg"}
              />
            </button>
              )
            : (
            <button
              data-testid="btn-initial"
              onClick={startCountdown}
              type="button"
              className={styles.countdownButton}
            >
              Iniciar um ciclo <img src="/icons/play.svg" />
            </button>
              )}
        </>
          )}
    </div>
  );
}
