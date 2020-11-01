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
  { id: uuidv4(), type: CardType.Defuse },
  { id: uuidv4(), type: CardType.Defuse },
  { id: uuidv4(), type: CardType.SeeTheFuture },
  { id: uuidv4(), type: CardType.SeeTheFuture },
  { id: uuidv4(), type: CardType.SeeTheFuture },
  { id: uuidv4(), type: CardType.SeeTheFuture },
  { id: uuidv4(), type: CardType.SeeTheFuture },
  { id: uuidv4(), type: CardType.Shuffle },
  { id: uuidv4(), type: CardType.Shuffle },
  { id: uuidv4(), type: CardType.Shuffle },
  { id: uuidv4(), type: CardType.Shuffle },
  { id: uuidv4(), type: CardType.Skip },
  { id: uuidv4(), type: CardType.Skip },
  { id: uuidv4(), type: CardType.Skip },
  { id: uuidv4(), type: CardType.Skip },
  { id: uuidv4(), type: CardType.Attack },
  { id: uuidv4(), type: CardType.Attack },
  { id: uuidv4(), type: CardType.Attack },
  { id: uuidv4(), type: CardType.Attack },
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
  currentPlayer: string,
  discard: GameState["discard"],
) => {
  game.players.forEach((player) => {
    io.to(users[player].socketId).emit("update_move", {
      hand: hands[player],
      deck: deck.length,
      hands: objectMap(hands, (hand: Card[]) => hand.length),
      currentPlayer,
      discard,
    });
  });
};

const getNextPlayer = (currentPlayer: string, players: string[]) => {
  const curr = players.indexOf(currentPlayer);
  const next = curr + 1 > players.length - 1 ? 0 : curr + 1;

  return players[next];
};

const getWinner = (players: string[], deadPlayers: string[]) => {
  return players.filter((player) => !deadPlayers.includes(player))[0];
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
      let deck: GameState["deck"] = shuffle([...exampleDeck]);
      const hands: GameState["hands"] = {};
      const currentPlayer = userId;

      game.players.forEach((player) => {
        hands[player] = [
          ...deck.splice(0, 4),
          {
            id: uuidv4(),
            type: CardType.Defuse,
          },
        ]; // deal 5 cards to each player
      });

      for (let i = 0; i < game.players.length; i += 1) {
        deck.push({
          id: uuidv4(),
          type: CardType.Bomb,
        });
      }

      deck = shuffle(deck);

      gameState[gameId] = {
        deck,
        hands,
        currentPlayer,
        discard: [],
        deadPlayers: [],
      };

      sendUpdateMove(game, deck, hands, currentPlayer, []);

      games[gameId].status = GameStatus.Started;

      io.emit("update_games", games);
    });

    socket.on("draw_card", (gameId: string) => {
      if (!games[gameId] || !gameState[gameId]) {
        console.warn("Cannot draw card for game with id", gameId);
        return;
      }

      const game = games[gameId];

      if (gameState[gameId].currentPlayer !== userId) {
        console.warn("It's not the players turn", userId, "in game", gameId);
        return;
      }

      if (gameState[gameId].deck.length <= 0) {
        console.warn(
          "There are no cards left to draw for game with id",
          gameId,
        );
        return;
      }

      const card = gameState[gameId].deck.splice(0, 1)[0];

      // Drawn a bomb
      if (card.type === CardType.Bomb) {
        const hand = gameState[gameId].hands[userId];
        const defuse = hand.findIndex((card) => card.type === CardType.Defuse);

        console.log("User", userId, "has drawn a bomb");

        if (defuse >= 0) {
          const defuseCard = gameState[gameId].hands[userId].splice(
            defuse,
            1,
          )[0]; // remove defuse card
          gameState[gameId].discard.push(defuseCard);

          // put bomb back into deck
          gameState[gameId].deck.push(card);
          gameState[gameId].deck = shuffle(gameState[gameId].deck);
        } else {
          gameState[gameId].discard.push(card);
          gameState[gameId].hands[userId] = []; // u dead bro

          // annouce the death of the player
          game.players.forEach((player) => {
            io.to(users[player].socketId).emit("game_event", {
              player: userId,
              condition: "lose",
            });
          });
          gameState[gameId].deadPlayers.push(userId);

          if (
            gameState[gameId].deadPlayers.length ===
            game.players.length - 1
          ) {
            // find the winner
            const winner = getWinner(
              game.players,
              gameState[gameId].deadPlayers,
            );

            // announce the winner
            game.players.forEach((player) => {
              io.to(users[player].socketId).emit("game_event", {
                player: winner,
                condition: "win",
              });
            });
          }
        }
      } else {
        gameState[gameId].hands[userId].push(card);
      }

      console.log("User", userId, "has drawn card", card);

      const deck = gameState[gameId].deck;
      const hands = gameState[gameId].hands;
      const discard = gameState[gameId].discard;
      const modifier = gameState[gameId].modifier;
      let nextPlayer = gameState[gameId].currentPlayer;

      if (modifier) {
        if (modifier.card.type === CardType.Attack) {
          nextPlayer = modifier.target;
        }

        gameState[gameId].modifier = undefined; // clear modifier for next round
      } else {
        nextPlayer = getNextPlayer(
          gameState[gameId].currentPlayer,
          game.players,
        );
        gameState[gameId].currentPlayer = nextPlayer;
      }

      sendUpdateMove(game, deck, hands, nextPlayer, discard);
    });

    socket.on(
      "play_card",
      (gameId: string, cardId: string, targetPlayer?: string) => {
        if (!games[gameId] || !gameState[gameId]) {
          console.warn("Cannot play card for game with id", { gameId, cardId });
          return;
        }

        if (gameState[gameId].currentPlayer !== userId) {
          console.warn("It's not the players turn", userId, "in game", gameId);
          return;
        }

        const game = games[gameId];
        const cardIndex = gameState[gameId].hands[userId].findIndex(
          (card) => card.id === cardId && card.type !== CardType.Defuse,
        );

        if (cardIndex < 0) {
          console.warn("Cannot play card for game with id", { gameId, cardId });
          return;
        }

        const card = gameState[gameId].hands[userId].splice(cardIndex, 1)[0];

        console.log("User", userId, "played card", card);
        gameState[gameId].discard.push(card);

        let nextPlayer = gameState[gameId].currentPlayer;

        //
        // Cards
        //
        // Skip
        if (card.type === CardType.Skip) {
          nextPlayer = getNextPlayer(nextPlayer, game.players);
          gameState[gameId].currentPlayer = nextPlayer;
        }
        // See the future
        if (card.type === CardType.SeeTheFuture) {
          socket.emit("play_cart_event", {
            card: CardType.SeeTheFuture,
            cards: gameState[gameId].deck.slice(0, 3),
          });
        }
        // Shuffle
        if (card.type === CardType.Shuffle) {
          gameState[gameId].deck = shuffle(gameState[gameId].deck);
        }
        // Attack
        if (card.type === CardType.Attack) {
          nextPlayer = getNextPlayer(nextPlayer, game.players);
          gameState[gameId].currentPlayer = nextPlayer;
          gameState[gameId].modifier = {
            card,
            target: nextPlayer,
          };
        }

        const deck = gameState[gameId].deck; // this might get altered by the card action
        const hands = gameState[gameId].hands;
        const discard = gameState[gameId].discard;

        sendUpdateMove(game, deck, hands, nextPlayer, discard);
      },
    );

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