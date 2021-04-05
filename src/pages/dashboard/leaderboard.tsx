import { useContext, useEffect, useState } from "react";
import axios from "axios";

import { Menu } from "../../components/Menu";
import { Loading } from "../../components/Loading";

import { UserContext } from "../../contexts/UserContext";

import styles from "../../styles/pages/Leaderboard.module.css";

export type RankOfUsers = {
  _id: string;
  username: string;
  level: number;
  experience: number;
  avatar: string;
  challenges: number;
  twitterUrl: string;
  userId: string;
};

export default function Leaderboard() {
  const [rankOfUsers, setRankOfUsers] = useState<Array<RankOfUsers>>([]);
  const [hasError, setHasError] = useState(false);

  const { isAuthenticated, loading } = useContext(UserContext);

  useEffect(() => {
    async function getRank() {
      try {
        const response = await axios.get("/api/rank");
        setRankOfUsers(response.data.rankOfUsers);
      } catch (error) {
        handleError(error);
      }
    }
    getRank();
  }, []);

  function handleError(err) {
    if (err) setHasError(true);
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {isAuthenticated ? (
        <div className={styles.container} data-testid="leaderboard">
          <Menu />
          <div className={styles.containerLeaderboard}>
            <h1>Leaderboard</h1>
            {hasError ? (
              <span
                style={{ color: "darkorange", marginTop: "2rem" }}
                data-testid="error-rank"
              >
                Tivemos um erro ao carregar o Rank de usuários =(
              </span>
            ) : rankOfUsers.length ? (
              <div className={styles.rank} data-testid="rank">
                <table>
                  <thead>
                    <tr>
                      <th>Posição</th>
                      <th>Usuário</th>
                      <th>Desafios</th>
                      <th>Experiência</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankOfUsers.map((user, index) => (
                      <tr key={index + 1} data-testid="user">
                        <td className={styles.position}>{index + 1}</td>
                        <td>
                          <div className={styles.avatar}>
                            {user.avatar ? (
                              <img src={user.avatar} alt="avatar" />
                            ) : null}
                          </div>
                          <div className={styles.info}>
                            <p>{user.username}</p>
                            <span>
                              <img src="/icons/level.svg" />
                              Level {user.level}
                            </span>
                          </div>
                        </td>
                        <td>
                          <p>
                            <span>{user.challenges} </span>
                            completos
                          </p>
                        </td>
                        <td>
                          <p>
                            <span>{user.experience} </span>
                            xp
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <span
                style={{ color: "darkorange", marginTop: "2rem" }}
                data-testid="not-users"
              >
                Poxa =( a lista de rank de usuários está vazia.
              </span>
            )}
          </div>
        </div>
      ) : (
        <Loading routeName="/login" />
      )}
    </>
  );
}
