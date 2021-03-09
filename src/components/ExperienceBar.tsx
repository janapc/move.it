import { useContext } from "react";

import { ChallengesContext } from "../contexts/ChallengesContext";

import styles from "../styles/components/ExperienceBar.module.css";

export function ExperienceBar () {
  const { currentExperience, expirenceToNextLevel } = useContext(
    ChallengesContext
  );

  const percentToNextLevel: number =
    Math.round(currentExperience * 100) / expirenceToNextLevel;

  return (
    <header className={styles.experienceBar}>
      <span>0 xp</span>

      <div>
        <div
          data-testid="bar-width-percent"
          style={{ width: `${percentToNextLevel}%` }}
        />
        <span
          data-testid="bar-left-percent"
          className={styles.currentExperience}
          style={{ left: `${percentToNextLevel}%` }}
        >
          {currentExperience} xp
        </span>
      </div>

      <span data-testid="expirence-to-next-level">{expirenceToNextLevel} xp</span>
    </header>
  );
}
