import { KeyObject } from "crypto";
import { Server } from "http";
import socketIO, { Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";

import {
  User,
  Game,
  GameStatus,
  GameState,
  CardType,
  Card,
} from "../../../contract/events";

let io: socketIO.Server = null;

const users: { [key: string]: User } = {};
const games: { [key: string]: Game } = {};
const gameState: { [key: string]: GameState } = {};

const exampleDeck = [
  { id: uuidv4(), type: CardType.Bomb },
  { id: uuidv4(), type: CardType.Bomb },
  { id: uuidv4(), type: CardType.Defuse },
  { id: uuidv4(), type: CardType.Defuse },
  { id: uuidv4(), type: CardType.Nothing },
  { id: uuidv4(), type: CardType.Nothing },
  { id: uuidv4(), type: CardType.Nothing },
  { id: uuidv4(), type: CardType.Nothing },
  { id: uuidv4(), type: CardType.Nothing },
  { id: uuidv4(), type: CardType.Nothing },
  { id: uuidv4(), type: CardType.Nothing },
  { id: uuidv4(), type: CardType.Nothing },
  { id: uuidv4(), type: CardType.Nothing },
  { id: uuidv4(), type: CardType.Nothing },
  { id: uuidv4(), type: CardType.Nothing },
];

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
function shuffle(a: any) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const objectMap = (obj: any, fn: any) =>
  // @ts-ignore
  Object.fromEntries(Object.entries(obj).map(([k, v], i) => [k, fn(v, k, i)]));

const sendUpdateMove = (
  game: Game,
  deck: GameState["deck"],
  hands: GameState["hands"],
) => {
  game.players.forEach((player) => {
    io.to(users[player].socketId).emit("update_move", {
      hand: hands[player],
      deck: deck.length,
      hands: objectMap(hands, (hand: Card[]) => hand.length),
    });
  });
};

export function createSocketServer(server: Server) {
  io = socketIO(server);

  io.on("connection", (socket: Socket) => {
    const userId = uuidv4();

    console.log("New user joined", userId);

    users[userId] = { id: userId, socketId: socket.id };

    socket.emit("welcome", { userId, games });

    socket.on("join_game", (gameId: string) => {
      if (
        games[gameId].status === GameStatus.Waiting &&
        games[gameId].host !== userId &&
        !games[gameId].players.includes(userId)
      ) {
        games[gameId].players.push(userId);
        users[userId].activeGame = gameId;

        io.emit("update_games", games);
        socket.emit("joined_game", gameId);
      }
    });

    socket.on("create_game", (name: string) => {
      const gameId = uuidv4();

      games[gameId] = {
        id: gameId,
        name,
        host: userId,
        players: [userId],
        status: GameStatus.Waiting,
      };

      users[userId].activeGame = gameId;

      io.emit("update_games", games);
      socket.emit("joined_game", gameId);
    });

    socket.on("start_game", (gameId: string) => {
      if (games[gameId].host !== userId) {
        return;
      }

      const game = games[gameId];
      const deck: GameState["deck"] = shuffle([...exampleDeck]);
      const hands: GameState["hands"] = {};
      game.players.forEach((player) => {
        hands[player] = deck.splice(0, 3); // deal 3 cards to each player
      });

      gameState[gameId] = {
        deck,
        hands,
      };

      sendUpdateMove(game, deck, hands);

      games[gameId].status = GameStatus.Started;

      io.emit("update_games", games);
    });

    socket.on("draw_card", (gameId: string) => {
      if (!games[gameId] || !gameState[gameId]) {
        console.warn("Cannot draw card for game with id", gameId);
        return;
      }

      const game = games[gameId];

      if (gameState[gameId].deck.length <= 0) {
        console.warn(
          "There are no cards left to draw for game with id",
          gameId,
        );
        return;
      }

      const card = gameState[gameId].deck.splice(0, 1)[0];
      gameState[gameId].hands[userId].push(card);

      console.log("User", userId, "has drawn card", card);

      const deck = gameState[gameId].deck;
      const hands = gameState[gameId].hands;

      sendUpdateMove(game, deck, hands);
    });

    socket.on("play_card", (gameId: string, cardId: string) => {
      if (!games[gameId] || !gameState[gameId]) {
        console.warn("Cannot play card for game with id", { gameId, cardId });
        return;
      }

      const game = games[gameId];

      const card = gameState[gameId].hands[userId].find(
        (card) => card.id === cardId,
      );
      gameState[gameId].hands[userId] = gameState[gameId].hands[userId].filter(
        (card) => card.id !== cardId,
      );

      console.log("played card", card);

      const deck = gameState[gameId].deck; // this might get altered by the card action
      const hands = gameState[gameId].hands;

      sendUpdateMove(game, deck, hands);
    });

    socket.on("leave_game", (gameId: string) => {
      if (!games[gameId]) {
        console.warn("User", userId, "cannot leave game with id", gameId);
        return;
      }

      if (
        games[gameId].status !== GameStatus.Started &&
        games[gameId].host === userId
      ) {
        delete games[gameId];
      } else {
        games[gameId].players = games[gameId].players.filter(
          (player) => player !== userId,
        );

        if (games[gameId].players.length === 0) {
          delete games[gameId];
        }
      }
      users[userId].activeGame = undefined;

      io.emit("update_games", games);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected", userId);

      const activeGame = games[users[userId].activeGame];

      if (activeGame) {
        // delete non-running host games
        if (
          activeGame.host === userId &&
          activeGame.status !== GameStatus.Started
        ) {
          delete games[activeGame.id];
        } else {
          // remove leaver from continously running games
          games[activeGame.id].players = games[activeGame.id].players.filter(
            (player) => player !== userId,
          );

          if (games[activeGame.id].players.length === 0) {
            delete games[activeGame.id];
          }
        }

        io.emit("update_games", games);
      }

      delete users[userId]; // ciao!
    });
  });
}
