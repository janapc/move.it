import { useContext } from "react";
import Head from "next/head";
import { GetServerSideProps } from "next";

import { CompletedChallenges } from "../../components/CompletedChallenges";
import { Countdown } from "../../components/Countdown";
import { ChallengeBox } from "../../components/ChallengeBox";
import { ExperienceBar } from "../../components/ExperienceBar";
import { Profile } from "../../components/Profile";
import { Menu } from "../../components/Menu";
import { Loading } from "../../components/Loading";

import { CountdownProvider } from "../../contexts/CountdownContext";
import { ChallengesProvider } from "../../contexts/ChallengesContext";
import { UserContext } from "../../contexts/UserContext";

import styles from "../../styles/pages/Home.module.css";

export type HomeProps = {
  level: number;
  currentExperience: number;
  challengesCompleted: number;
  expirenceTotal: number;
};

export default function Home (props: HomeProps) {
  const { isAuthenticated, loading } = useContext(UserContext);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {isAuthenticated
        ? (
        <ChallengesProvider
          level={props.level}
          currentExperience={props.currentExperience}
          challengesCompleted={props.challengesCompleted}
          expirenceTotal={props.expirenceTotal}
        >
          <div className={styles.container} data-testid="home">
            <Menu />

            <div className={styles.containerHome}>
              <Head>
                <title>Início | move.it</title>
              </Head>

              <ExperienceBar />

              <CountdownProvider>
                <section>
                  <div>
                    <Profile />
                    <CompletedChallenges />
                    <Countdown />
                  </div>
                  <div>
                    <ChallengeBox />
                  </div>
                </section>
              </CountdownProvider>
            </div>
          </div>
        </ChallengesProvider>
          )
        : (
        <Loading routeName="/login" />
          )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {
    level,
    currentExperience,
    challengesCompleted,
    expirenceTotal
  } = ctx.req.cookies;

  return {
    props: {
      level: Number(level),
      currentExperience: Number(currentExperience),
      challengesCompleted: Number(challengesCompleted),
      expirenceTotal: Number(expirenceTotal)
    }
  };
};
