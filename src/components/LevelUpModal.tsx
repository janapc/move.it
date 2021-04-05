import { useContext } from "react";

import { ChallengesContext } from "../contexts/ChallengesContext";

import { encrypt } from "../utils/crypto";

import styles from "../styles/components/LevelUpModal.module.css";

export function LevelUpModal () {
  const {
    level,
    closeLevelUpModal,
    challengesCompleted,
    expirenceTotal
  } = useContext(ChallengesContext);

  async function handleTwitter () {
    try {
      const data = {
        level,
        challenges: challengesCompleted,
        experience: expirenceTotal
      };

      const encryptData = encrypt(data);

      window.open(`https://twitter.com/intent/tweet?url=http://localhost:3000/twitter?auth=${encryptData}`);
    } catch (error) {
      alert("Ocorreu um erro tente mais tarde!");
    }
  }

  return (
    <div className={styles.overlay} data-testid="modal">
      <div className={styles.container}>
        <header data-testid="level">{level}</header>

        <strong>Parabéns</strong>
        <p>Você alcançou um novo level.</p>

        <button
          data-testid="btn-close-modal"
          type="button"
          onClick={closeLevelUpModal}
          className={styles.btnClose}
        >
          <img src="/icons/close.svg" alt="close modal" />
        </button>

        <div className={styles.btnTwitter}>
          <button
            data-testid="btn-twitter-modal"
            type="button"
            onClick={handleTwitter}
          >
            Compartilhar no Twitter
            <img src="/icons/twitter.svg" alt="share to Twitter" />
          </button>
        </div>
      </div>
    </div>
  );
}
