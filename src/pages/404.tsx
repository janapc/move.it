import { CSSProperties } from "react";

export default function Custom404 () {
  return (
    <div style={styles.container as CSSProperties} data-testid="404">
      <h1 style={styles.title as CSSProperties}> Pagina não encontrada</h1>
      <img src="/icons/plug.svg" alt="" />
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    width: "100vw",
    height: "100vh"
  },
  title: {
    color: "var(--blue)",
    marginBottom: "2rem"
  }
};
