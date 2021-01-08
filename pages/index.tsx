import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Game, User, GameStatus } from "../contract/events";
import {
  createGame,
  handleMessage,
  joinGame,
  updateUserInfo,
} from "../lib/socket";

import Footer from "../components/layout/Footer";
import Main from "../components/layout/Main";
import Button from "../components/common/Button";
import TextField from "../components/common/TextField";
import Modal from "../components/modal/Modal";
import Wrapper from "../components/layout/Wrapper";

interface IHomeProps {
  user: User;
  games: { [key: string]: Game };
}

type CreateGameForm = {
  gameName: string;
};

const Home: React.FC<IHomeProps> = ({ user, games }) => {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const { handleSubmit, register, errors } = useForm<CreateGameForm>();

  useEffect(() => {
    handleMessage("joined_game", (error, gameId) => {
      router.push(`/game/${gameId}`);
    });
  });

  const joinGameHandler = (gameId: string) => {
    joinGame(gameId);
  };

  const createGameHandler = (data: CreateGameForm) => {
    createGame(data.gameName);
  };

  const updateUserInfoHandler = (username: string) => {
    updateUserInfo(username);
  };

  if (!user) {
    return null;
  }

  return (
    <Wrapper>
      <Head>
        <title>Don't explode</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Main>
        <Modal title="What's your name?" isOpen={!user.name}>
          <form
            onSubmit={handleSubmit((data: { userName: string }) =>
              updateUserInfoHandler(data.userName)
            )}
          >
            <TextField
              register={register}
              validationRules={{ required: true, minLength: 3 }}
              placeholder="Your name..."
              name="userName"
              autoFocus
            />
            <Button type="submit">Confirm</Button>
          </form>
        </Modal>

        <div
          style={{ maxHeight: "60%" }}
          className="w-full max-w-screen-md mx-8 mt-0 mb-4 bg-blue-200 overflow-y-auto"
        >
          {games && Object.values(games).length > 0 ? (
            <table className="w-full text-center">
              <thead>
                <tr>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2">Host</th>
                  <th className="p-2">Players</th>
                  <th className="p-2">Status</th>
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
                    <td className="p-2 ml-4">
                      {game.playerInfos[game.host].name}
                    </td>
                    <td className="p-2 ml-4">{game.players.length} / 4</td>
                    <td className="p-2 ml-4">{game.status}</td>
                    <td className="px-2 ml-4 text-right">
                      {game.status === GameStatus.Waiting &&
                      game.players.length < 4 ? (
                        <Button onClick={() => joinGameHandler(game.id)}>
                          Join
                        </Button>
                      ) : (
                        <Button disabled={true}>Join</Button>
                      )}
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
          <Button onClick={() => setModalOpen(true)}>Create Game</Button>

          <Modal
            title="Create new game"
            isOpen={modalOpen}
            onRequestClose={() => setModalOpen(false)}
          >
            <form onSubmit={handleSubmit(createGameHandler)}>
              <TextField
                register={register}
                validationRules={{ required: true }}
                placeholder="Name of your game..."
                name="gameName"
                autoFocus
              />
              <Button type="submit">Create</Button>
            </form>
          </Modal>
        </div>
      </Main>

      <Footer />
    </Wrapper>
  );
};

export default Home;
