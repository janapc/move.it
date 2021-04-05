import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import styles from "../styles/components/Menu.module.css";

export function Menu () {
  const router = useRouter();
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const currentTheme = localStorage.getItem("@theme") ?? "light";

    setTheme(currentTheme);
    document.documentElement.setAttribute("data-theme", currentTheme);
  });

  function toggleTheme () {
    let targetTheme = "light";

    if (theme === "light") {
      targetTheme = "dark";
    }

    document.documentElement.setAttribute("data-theme", targetTheme);

    setTheme(targetTheme);
    localStorage.setItem("@theme", targetTheme);
  }

  return (
    <div className={styles.containerMenu}>
      <img className={styles.logo} src="/icons/logo.svg" alt="logo" />
      <div className={styles.menu} data-testid="menu">
        <button
          onClick={() => router.push("/dashboard/home")}
          data-testid="btn-change-route-home"
        >
          {router.pathname === "/dashboard/home"
            ? (
            <>
              <div />
              <img src="/icons/home-selected.svg" alt="home" />
            </>
              )
            : (
            <img src="/icons/home.svg" alt="home" />
              )}
        </button>

        <button
          onClick={() => router.push("/dashboard/leaderboard")}
          data-testid="btn-change-route-leaderboard"
        >
          {router.pathname === "/dashboard/leaderboard"
            ? (
            <>
              <div />
              <img src="/icons/leaderboard-selected.svg" alt="leaderboard" />
            </>
              )
            : (
            <img src="/icons/leaderboard.svg" alt="leaderboard" />
              )}
        </button>
      </div>
      <button
        type="button"
        onClick={toggleTheme}
        className={styles.toggle}
        data-testid="btn-theme"
      >
        <img src={theme === "light" ? "/icons/sun.svg" : "/icons/moon.svg"} />
      </button>
    </div>
  );
}
