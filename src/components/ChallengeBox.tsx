import { useContext } from "react";

import { ChallengesContext } from "../contexts/ChallengesContext";
import { CountdownContext } from "../contexts/CountdownContext";

import styles from "../styles/components/ChallengeBox.module.css";

export function ChallengeBox () {
  const { activeChallenge, resetChallenge, completeChallenge } = useContext(ChallengesContext);
  const { resetCountdown } = useContext(CountdownContext);

  function handleChallengeSucceeded () {
    completeChallenge();
    resetCountdown();
  }

  function handleChallengeFailed () {
    resetChallenge();
    resetCountdown();
  }

  return (
    <div className={styles.challengeBoxContainer}>
      {activeChallenge
        ? (
        <div className={styles.challengeActive}>
          <header data-testid="header">Ganhe {activeChallenge.amount} xp</header>

          <main data-testid="main">
            <img data-testid="img-main" src={`icons/${activeChallenge.type}.svg`} alt={activeChallenge.type} />
            <strong>Novo desafio</strong>
            <p>{activeChallenge.description}</p>
          </main>

          <footer>
            <button data-testid="btn-failed" onClick={handleChallengeFailed} type="button" className={styles.challengeFailButton}>
              Falhei
            </button>
            <button data-testid="btn-succeeded" onClick={handleChallengeSucceeded} type="button" className={styles.challengeSucceededButton}>
              Completei
            </button>
          </footer>
        </div>
          )
        : (
        <div className={styles.challengeNotActive}>
          <strong>Finalize um ciclo para recenber um desafio</strong>

          <p>
            <img src="icons/level-up.svg" alt="Level Up" />
            Avance de level completando os desafios.
          </p>
        </div>
          )}
    </div>
  );
}
