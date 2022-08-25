import type { AppProps } from "next/app";
import { useEffect, useState } from "react";

import { Game, GameState, MessageTypes, User } from "../contract/events";
import { handleMessage } from "../lib/socket";

import "../styles/globals.css";

const MyApp = ({ Component, pageProps }: AppProps) => {
  const [games, setGames] = useState<{ [key: string]: Game }>({});
  const [user, setUser] = useState<Omit<User, "socketId">>();

  useEffect(() => {
    handleMessage("welcome", (error, data) => {
      setUser({ id: data.userId });
      setGames(data.games);
    });

    handleMessage(MessageTypes.UpdateUserInfo, (error, data) => {
      setUser(data);
    });

    handleMessage("update_games", (error, games) => {
      setGames(games);
    });
  }, []);

  return <Component {...pageProps} user={user} games={games} />;
};

export default MyApp;
