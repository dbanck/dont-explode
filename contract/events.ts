export interface User {
  id: string;
  socketId: string;
  name?: string;
  activeGame?: string;
}

export enum GameStatus {
  Waiting,
  Started,
  Complete,
}

export interface Game {
  id: string;
  host: string;
  name: string;
  players: string[];
  status: GameStatus;
}

export interface GameState {
  deck: Card[];
  hands: {
    [key: string]: Card[];
  };
}

export enum CardType {
  Bomb,
  Defuse,
  Shuffle,
  SeeTheFuture,
  Nothing,
}

export interface Card {
  id: string;
  type: CardType;
}

export type DeckTemplate = {
  [key in CardType]: number;
};
