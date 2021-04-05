import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from "react";
import axios from "axios";
import Cookies from "js-cookie";

import challenges from "../../challenges.json";

import { LevelUpModal } from "../components/LevelUpModal";
import { UserContext } from "./UserContext";

interface ChallengesProviderProps {
  children: ReactNode;
  level: number;
  currentExperience: number;
  challengesCompleted: number;
  expirenceTotal: number;
}

interface Challenge {
  type: "body" | "eye";
  description: string;
  amount: number;
}

export interface ChallengesContextData {
  level: number;
  currentExperience: number;
  expirenceToNextLevel: number;
  expirenceTotal: number;
  challengesCompleted: number;
  activeChallenge: Challenge;
  startNewChallenge: () => void;
  resetChallenge: () => void;
  completeChallenge: () => void;
  closeLevelUpModal: () => void;
}

export const ChallengesContext = createContext({} as ChallengesContextData);

export function ChallengesProvider ({
  children,
  ...rest
}: ChallengesProviderProps) {
  const { user } = useContext(UserContext);

  const [level, setLevel] = useState(rest.level ?? 1);
  const [expirenceTotal, setExpirenceTotal] = useState(
    rest.expirenceTotal ?? 0
  );
  const [currentExperience, setCurrentExperience] = useState(
    rest.currentExperience ?? 0
  );
  const [challengesCompleted, setChallengesCompleted] = useState(
    rest.challengesCompleted ?? 0
  );

  const [activeChallenge, setActiveChallenge] = useState(null);
  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);

  const expirenceToNextLevel = Math.pow((level + 1) * 4, 2);

  useEffect(() => {
    Notification.requestPermission();
  }, []);

  useEffect(() => {
    async function saveDataOfChallenges () {
      Cookies.set("level", String(level));
      Cookies.set("currentExperience", String(currentExperience));
      Cookies.set("challengesCompleted", String(challengesCompleted));
      Cookies.set("expirenceTotal", String(expirenceTotal));

      await axios.post(
        "/api/user",
        {
          challenges: challengesCompleted,
          level,
          experience: expirenceTotal
        },
        {
          headers: {
            Authorization: `Bearer ${user.token ?? ""}`
          }
        }
      );
    }

    saveDataOfChallenges();
  }, [level, currentExperience, challengesCompleted, expirenceTotal]);

  function startNewChallenge () {
    const randomChallengeIndex = Math.floor(Math.random() * challenges.length);
    const challenge = challenges[randomChallengeIndex];

    setActiveChallenge(challenge);
    new Audio("/notification.mp3").play();

    if (Notification.permission === "granted") {
      new Notification("Novo desafio 🎉", {
        body: `Valendo ${challenge.amount}xp!`
      });
    }
  }

  function resetChallenge () {
    setActiveChallenge(null);
  }

  function completeChallenge () {
    if (!activeChallenge) return;

    const { amount } = activeChallenge;

    let finalExperience = currentExperience + amount;

    setExpirenceTotal(expirenceTotal + amount);

    if (finalExperience >= expirenceToNextLevel) {
      finalExperience = finalExperience - expirenceToNextLevel;

      levelUp();
    }

    setCurrentExperience(finalExperience);
    setActiveChallenge(null);
    setChallengesCompleted(challengesCompleted + 1);
  }

  function levelUp () {
    setLevel(level + 1);
    setIsLevelUpModalOpen(true);
  }

  function closeLevelUpModal () {
    setIsLevelUpModalOpen(false);
  }

  return (
    <ChallengesContext.Provider
      value={{
        level,
        currentExperience,
        challengesCompleted,
        activeChallenge,
        expirenceToNextLevel,
        expirenceTotal,
        startNewChallenge,
        resetChallenge,
        completeChallenge,
        closeLevelUpModal
      }}
    >
      {children}
      {isLevelUpModalOpen && <LevelUpModal />}
    </ChallengesContext.Provider>
  );
}
