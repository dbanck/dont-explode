import Head from "next/head";
import { useRouter } from "next/router";
import { SyntheticEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Game, User } from "../contract/events";
import {
  createGame,
  handleMessage,
  joinGame,
  leaveGame,
  startGame,
} from "../lib/socket";
import styles from "../styles/Home.module.css";

interface IHomeProps {
  user: User;
  games: { [key: string]: Game };
}

type CreateGameForm = {
  name: string;
};

const Home: React.FC<IHomeProps> = ({ user, games }) => {
  const handleJoinGame = (e: SyntheticEvent<HTMLButtonElement>) => {
    joinGame(e.currentTarget.dataset.gameId);
  };

  const onSubmitHandler = (data: CreateGameForm) => {
    createGame(data.name);
  };

  useEffect(() => {
    handleMessage("joined_game", (error, gameId) => {
      router.push(`/game/${gameId}`);
    });
  });

  const [createModalOpen, setCreateModalOpen] = useState(false);

  const router = useRouter();
  const { handleSubmit, register, errors } = useForm<CreateGameForm>();

  if (!user) {
    return null;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h4>Games</h4>
        <button onClick={() => setCreateModalOpen(true)}>Create Game</button>
        <ul>
          {games &&
            Object.values(games).map((game) => (
              <li key={game.id}>
                <span>
                  {game.name}
                  <br />
                  Host: {game.host}
                  <br />
                  Players: {game.players.length} / 4
                  <br />
                  Status: {game.status}
                  <br />
                </span>

                <button data-game-id={game.id} onClick={handleJoinGame}>
                  join
                </button>
                <br />
                <br />
              </li>
            ))}
        </ul>

        {createModalOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.8)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <button
              style={{ position: "absolute", top: "20px", right: "20px" }}
              onClick={() => setCreateModalOpen(false)}
            >
              X
            </button>
            <form onSubmit={handleSubmit(onSubmitHandler)}>
              <input name="name" ref={register({ required: true })} />
              <button type="submit">Create</button>
            </form>
          </div>
        )}
      </main>

      <footer className={styles.footer}>Powered by Basti & Daniel</footer>
    </div>
  );
};

export default Home;
