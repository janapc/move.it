import { createContext, ReactNode, useEffect, useState } from "react";
import axios from "axios";

type UserProviderProps = {
  children: ReactNode;
};

type UserData = {
  username: string;
  avatar: string;
  token: string;
};

type UserSession = {
  username: string;
  token: string;
  avatar: string;
};

export interface UserContextData {
  user: UserData | null;
  isAuthenticated: boolean;
  loading: boolean;
  saveDataOfUser: ({ username, avatar, token }: UserData) => void;
}

export const UserContext = createContext({} as UserContextData);

export function UserProvider({ children }: UserProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);

  async function handleAuthentication(token) {
    try {
      const response = await axios.get("/api/authentication", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data && response.data.success === true) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      return error;
    }
  }

  async function saveDataOfUser({ username, avatar, token }: UserData) {
    setUser({ username, avatar, token });
    await handleAuthentication(token);
  }

  useEffect(() => {
    async function hasAuthentication() {
      try {
        const session = sessionStorage.getItem("user");
        const user: UserSession = JSON.parse(session);
        saveDataOfUser({
          username: user.username,
          avatar: user.avatar,
          token: user.token,
        });
        await handleAuthentication(user.token);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }
    hasAuthentication();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated,
        saveDataOfUser,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
