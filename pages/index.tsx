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
import Footer from "../components/layout/Footer";
import Main from "../components/layout/Main";
import Button from "../components/common/Button";

interface IHomeProps {
  user: User;
  games: { [key: string]: Game };
}

type CreateGameForm = {
  name: string;
};

const Home: React.FC<IHomeProps> = ({ user, games }) => {
  const handleJoinGame = (gameId: string) => {
    joinGame(gameId);
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
  const { handleSubmit, register, errors } = useForm<CreateGameForm>({
    defaultValues: { name: "Tolles Spiel" },
  });

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen">
      <Head>
        <title>Don't explode</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Main>
        <div
          style={{ maxHeight: "60%" }}
          className="w-full max-w-screen-md mx-8 mt-0 mb-4 bg-blue-200 overflow-y-auto"
        >
          {games && Object.values(games).length > 0 ? (
            <table className="w-full text-center">
              <thead>
                <tr>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 hidden">Host</th>
                  <th className="p-2">Players</th>
                  <th className="p-2 hidden">Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {Object.values(games).map((game, idx) => (
                  <tr
                    key={game.id}
                    className={idx % 2 ? "bg-blue-100" : "bg-white"}
                  >
                    <td className="p-2 w-full text-left">{game.name}</td>
                    <td className="p-2 ml-4 hidden">{game.host}</td>
                    <td className="p-2 ml-4">{game.players.length} / 2</td>
                    <td className="p-2 ml-4 hidden">{game.status}</td>
                    <td className="px-2 ml-4 text-right">
                      <Button clickHandler={() => handleJoinGame(game.id)}>
                        Join
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-2 text-center text-sm italic">No Games yet</div>
          )}
        </div>
        <div className="w-full max-w-screen-md m-8 mt-0 text-right">
          <Button clickHandler={() => setCreateModalOpen(true)}>
            Create Game
          </Button>
        </div>

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
              color: "white",
            }}
          >
            <button
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                color: "white",
              }}
              onClick={() => setCreateModalOpen(false)}
            >
              X
            </button>
            <form onSubmit={handleSubmit(onSubmitHandler)}>
              <input
                name="name"
                ref={register({ required: true })}
                style={{ color: "black" }}
              />
              <button type="submit">Create</button>
            </form>
          </div>
        )}
      </Main>

      <Footer />
    </div>
  );
};

export default Home;
