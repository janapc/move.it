import { useContext } from "react";

import { ChallengesContext } from "../contexts/ChallengesContext";
import { UserContext } from "../contexts/UserContext";

import styles from "../styles/components/Profile.module.css";

export function Profile () {
  const { level } = useContext(ChallengesContext);
  const { user, loading } = useContext(UserContext);

  return (
    <>
      {!loading && (
        <div className={styles.profileContainer}>
          {user.avatar ? <img src={user.avatar} alt={user.username} />: null}
          <div data-testid="profile">
            <strong data-testid="name">{user.username}</strong>
            <p data-testid="level">
              <img src="/icons/level.svg" alt="level" />
              Level {level}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
