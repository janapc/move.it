import { GetServerSideProps } from "next";

import { decrypt } from "../utils/crypto";

import { Loading } from "../components/Loading";

import styles from "../styles/pages/Twitter.module.css";

type TwitterProps = {
  level: string;
  challenges: string;
  experience: string;
};

export default function Twitter(props: TwitterProps) {
  return (
    <>
      {Object.keys(props).length ? (
        <div className={styles.containerTwitter} data-testid="twitter">
          <div className={styles.nextLevel}>
            <h2 data-testid="level-text">{props.level}</h2>
            <p>Avancei para o próximo level</p>
          </div>
          <div className={styles.info}>
            <div>
              <h4>DESAFIOS</h4>
              <p data-testid="challenges-text">
                <span>{props.challenges}</span> completos
              </p>
            </div>
            <div>
              <h4>EXPERIÊNCIA</h4>
              <p data-testid="experience-text">
                <span>{props.experience} </span>xp
              </p>
            </div>
            <div>
              <img src="/logo-full.svg" alt="logo" />
            </div>
          </div>
        </div>
      ) : <Loading routeName="/404"/>}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const query = ctx.query;
  const params = query.auth.split(",");
  let props;

  try {
    const data = decrypt({
      iv: params[0],
      key: params[1],
      encrypted: params[2],
    });

    let dataFormated = JSON.parse(data);

    props = {
      level: String(dataFormated.level),
      challenges: String(dataFormated.challenges),
      experience: String(dataFormated.experience),
    };
  } catch (error) {
    props = {};
  }

  return {
    props
  };
};
