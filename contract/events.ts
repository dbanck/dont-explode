export enum MessageTypes {
  PlayCard = "play_card",
  SelectCard = "select_card",
}

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

export enum AllowedActions {
  DrawCard,
  PlayCard,
  AlterTheFuture3,
  AlterTheFuture5,
}

export interface GameState {
  deck: Card[];
  hands: {
    [key: string]: Card[];
  };
  currentPlayer: string;

  currentPlayerActions: AllowedActions[];
  selectCardPlayers: {
    [key: string]: Card | undefined;
  };

  discard: Card[];
  deadPlayers: string[];
  modifier?: {
    card: Card;
    target: string;
  };
}

export enum CardType {
  Bomb,
  Defuse,
  Shuffle,
  SeeTheFuture,
  Nothing,
  Skip,
  Attack,
  Favor,
  AlterTheFuture3,
  AlterTheFuture5,
}

export interface Card {
  id: string;
  type: CardType;
}

export type HiddenCard = Pick<Card, "id">;

export type DeckTemplate = {
  [key in CardType]: number;
};
