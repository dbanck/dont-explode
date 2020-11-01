import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Card, CardType, Game, GameStatus, User } from "../../contract/events";
import {
  handleMessage,
  leaveGame,
  startGame,
  drawCard,
  playCard,
} from "../../lib/socket";

interface IGameProps {
  user: User;
  games: { [key: string]: Game };
}

const GamePage: React.FC<IGameProps> = ({ user, games }) => {
  const [deck, setDeck] = useState<number>(0);
  const [hand, setHand] = useState<Card[]>();
  const [hands, setHands] = useState<{ [key: string]: number }>();

  const router = useRouter();

  const { gameId } = router.query;
  const currentGame = games[gameId as string];

  const handleLeaveGame = () => {
    router.push("/");
  };

  const handleStartGame = () => {
    startGame(currentGame.id);
  };

  const handleDrawCard = () => {
    drawCard(currentGame.id);
  };

  const handlePlayCard = (cardId: string) => {
    playCard(currentGame.id, cardId);
  };

  useEffect(() => {
    handleMessage("game_start", (error, data) => {
      setDeck(data.deck);
      setHand(data.hand);
      setHands(data.hands);
    });

    handleMessage("update_move", (error, data) => {
      setDeck(data.deck);
      setHand(data.hand);
      setHands(data.hands);
    });

    // effect...
    return () => {
      if (currentGame) {
        leaveGame(currentGame.id);
      }
    };
  }, []);

  if (!currentGame) {
    if (typeof window !== "undefined") {
      router.push("/");
    }

    return null;
  }

  if (currentGame.status === GameStatus.Waiting) {
    return (
      <div>
        <p>Waiting for players {currentGame.players.length} / 4</p>

        {currentGame.host === user.id && (
          <button onClick={handleStartGame}>start</button>
        )}

        <button onClick={handleLeaveGame}>leave</button>
      </div>
    );
  }

  const dummyCardName = (type: Card["type"]) => {
    switch (type) {
      case CardType.Bomb:
        return "Bomb";
      case CardType.Defuse:
        return "Defuse";
      case CardType.Nothing:
        return "Nothing";
      case CardType.SeeTheFuture:
        return "See the future";
      case CardType.Shuffle:
        return "Shake it like a polaroid picture";
    }
  };

  return (
    <div>
      <h1>Game started: {gameId}</h1>
      <div>
        <div>
          Deck-Size: {deck} <button onClick={handleDrawCard}>Draw</button>
        </div>
        <div>
          <h2>Hand</h2>
          <ul>
            {hand.map((card) => (
              <li
                style={{}}
                key={card.id}
                onClick={() => handlePlayCard(card.id)}
              >
                {dummyCardName(card.type)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GamePage;
