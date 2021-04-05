import { useState, useContext } from "react";
import { useRouter } from "next/router";
import axios from "axios";

import styles from "../styles/pages/Login.module.css";
import { UserContext } from "../contexts/UserContext";

type Authentication = {
  data: {
    token: string;
    success: boolean;
  };
};

export default function Login() {
  const [username, setUsername] = useState("");
  const [hasError, setHasError] = useState(false);

  const router = useRouter();
  const { saveDataOfUser } = useContext(UserContext);

  async function handleLogin() {
    setHasError(false);
    const url = `https://api.github.com/users/${username}`;

    try {
      const response = await axios.get(url);
      const user = {
        username: response.data.login,
        avatar: response.data.avatar_url,
      };


      const authentication: Authentication = await axios.post(
        "/api/authentication",
        { ...user, userid: response.data.id, nodeid: response.data.node_id }
      );

      await saveDataOfUser({
        username: user.username,
        avatar: user.avatar,
        token: authentication.data.token,
      });

      sessionStorage.setItem(
        "user",
        JSON.stringify({ ...user, token: authentication.data.token })
      );

      await axios.post(
        "/api/user",
        {
          ...user,
        },
        {
          headers: {
            Authorization: `Bearer ${authentication.data.token}`,
          },
        }
      );

      router.push("/dashboard/home");
    } catch (error) {
      handleError(error);
    }
    setUsername("");
  }

  function handleError(err) {
    if (err) setHasError(true);
  }

  return (
    <div className={styles.loginContainer}>
      <section>
        <div className={styles.loginLeft}>
          <img
            style={{ width: "90%" }}
            src={"/images/background-logo.svg"}
            alt="logo"
          />
        </div>
        <div className={styles.loginRight}>
          <img style={{ width: "90%" }} src="/images/logo.svg" alt="logo" />
          <h2>Bem-vindo</h2>

          <div className={styles.github}>
            <img
              style={{ width: 40, height: 40 }}
              src="/icons/github.svg"
              alt="github"
            />
            <p>Faça login com seu Github para começar</p>
          </div>

          <div className={styles.fields}>
            <div className={styles.fieldUsername}>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                type="text"
                placeholder="Digite seu username"
                data-testid="input-username"
              />
            </div>
            <button
              type="button"
              onClick={handleLogin}
              data-testid="btn-login"
              disabled={!username.length}
              className={
                username.length > 0
                  ? `${styles.btnLogin} ${styles.btnLoginAvailable}`
                  : `${styles.btnLogin} ${styles.btnLoginInactive}`
              }
            >
              <img
                style={{ width: 24, height: 24 }}
                src="/icons/arrow-right.svg"
                alt="arrow right"
              />
            </button>
          </div>
          {hasError && (
            <span
              data-testid="has-error"
              style={{ color: "darkorange", marginTop: "2rem" }}
            >
              Ocorreu algum erro inesperado com seu login =(
            </span>
          )}
        </div>
      </section>
    </div>
  );
}
