import SocketIOClient from "socket.io-client";

let socket: SocketIOClient.Socket;
const ENDPOINT = "http://localhost:5555";

export const establishConnection = () => {
  if (!socket) {
    socket = SocketIOClient(ENDPOINT);
  }
};

export const handleMessage = (message, callback) => {
  if (!socket) {
    establishConnection();
  }

  socket.on(message, (data) => {
    return callback(null, data);
  });
};

export const joinGame = (gameId: string) => {
  if (!socket) {
    throw new Error("No socket connection!");
  }

  socket.emit("join_game", gameId);
};

export const leaveGame = (gameId: string) => {
  if (!socket) {
    throw new Error("No socket connection!");
  }

  socket.emit("leave_game", gameId);
};

export const createGame = (name: string) => {
  if (!socket) {
    throw new Error("No socket connection!");
  }

  socket.emit("create_game", name);
};

export const startGame = (gameId: string) => {
  if (!socket) {
    throw new Error("No socket connection!");
  }

  socket.emit("start_game", gameId);
};

export const drawCard = (gameId: string) => {
  if (!socket) {
    throw new Error("No socket connection!");
  }

  socket.emit("draw_card", gameId);
};

export const playCard = (gameId: string, cardId: string) => {
  if (!socket) {
    throw new Error("No socket connection!");
  }

  socket.emit("play_card", gameId, cardId);
};