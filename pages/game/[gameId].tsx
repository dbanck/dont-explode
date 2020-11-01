import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import CardComponent from "../../components/card/Card";
import CardWrapper from "../../components/card/CardWrapper";
import { Card, CardType, Game, GameStatus, User } from "../../contract/events";
import {
  handleMessage,
  leaveGame,
  startGame,
  drawCard,
  playCard,
  hoverCard,
  unhoverCard,
} from "../../lib/socket";

interface IGameProps {
  user: User;
  games: { [key: string]: Game };
}

const GamePage: React.FC<IGameProps> = ({ user, games }) => {
  const [deck, setDeck] = useState<number>(0);
  const [hand, setHand] = useState<Card[]>();
  const [hands, setHands] = useState<{ [key: string]: number }>();
  const [currentPlayer, setCurrentPlayer] = useState<string>();
  const [cardOverlay, setCardOverlay] = useState<Card[]>([]);
  const [discardPile, setDiscardPile] = useState<Card[]>([]);
  const [loseScreen, setLoseScreen] = useState<boolean>(false);
  const [winScreen, setWinScreen] = useState<boolean>(false);
  const [hovering, setHovering] = useState<string[]>([]);

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

  const handlePlayCard = (card: Card) => {
    if (card.type === CardType.Favor) {
      // TODO: Select Player
    } else {
      playCard(currentGame.id, card.id);
    }
  };

  const handleHover = (cardId: string) => {
    hoverCard(currentGame.id, cardId);
  };

  const handleUnhover = () => {
    unhoverCard(currentGame.id);
  };

  const closeCardOverlay = () => {
    setCardOverlay([]);
  };

  useEffect(() => {
    handleMessage("update_move", (error, data) => {
      setDeck(data.deck);
      setHand(data.hand);
      setHands(data.hands);
      setCurrentPlayer(data.currentPlayer);
      setDiscardPile(data.discard);
      setHovering(["3"]); // TODO! set from data. faking hovering some cards by index for now
    });

    handleMessage("play_cart_event", (error, data) => {
      switch (data.card) {
        case CardType.SeeTheFuture:
          setCardOverlay(data.cards);
          break;
        default:
          console.log("Cannot handle", data);
          break;
      }
    });

    handleMessage("game_event", (error, data) => {
      if (data.player === user.id && data.condition === "lose") {
        setLoseScreen(true);
      }
      if (data.player === user.id && data.condition === "win") {
        setWinScreen(true);
      }
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

  const buildDummyCard = (type: Card["type"]) => {
    switch (type) {
      case CardType.Bomb:
        return (
          <CardComponent
            title="BOOOOM!"
            description="Show this card immediatly."
            imageUrl="https://images.unsplash.com/photo-1530433331547-e064ffe8eef1?&auto=format&fit=crop&w=300"
          />
        );
      case CardType.Defuse:
        return (
          <CardComponent
            title="Defuse"
            description="Put your last drawn card back into the deck."
            imageUrl="https://images.unsplash.com/photo-1591455484074-d6bffbec9fae?auto=format&fit=crop&w=300"
          />
        );
      case CardType.Nothing:
        return (
          <CardComponent
            title="Nothing"
            description="void"
            imageUrl="https://images.unsplash.com/photo-1503248947681-3198a7abfcc9?auto=format&fit=crop&w=300"
          />
        );
      case CardType.SeeTheFuture:
        return (
          <CardComponent
            title="See the future"
            description="Privately view the top three cards of the deck."
            imageUrl="https://images.unsplash.com/photo-1573537805874-4cedc5d389ce?auto=format&fit=crop&w=300"
          />
        );
      case CardType.Shuffle:
        return (
          <CardComponent
            title="Shuffle"
            description="Shuffle the draw pile."
            imageUrl="https://images.unsplash.com/photo-1590232670695-17fe0b35f454?auto=format&fit=crop&w=300"
          />
        );
      case CardType.Skip:
        return (
          <CardComponent
            title="Skip"
            description="End your turn without drawing a card."
            imageUrl="https://images.unsplash.com/photo-1518365658347-c4906efc5636?auto=format&fit=crop&w=300"
          />
        );
      case CardType.Attack:
        return (
          <CardComponent
            title="Attack"
            description="End your turn without drawing a card. Force the next player to take two turns."
            imageUrl="https://images.unsplash.com/photo-1514050566906-8d077bae7046?auto=format&fit=crop&w=300"
          />
        );
    }
  };

  const otherPlayers = currentGame.players.filter(
    (player) => player !== user.id
  );

  console.log(hovering);

  return (
    <div>
      <div>
        <div
          style={{
            position: "relative",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              position: "relative",
              transform: "scale(0.9)",
              height: 300,
              width: 400,
            }}
          >
            {Array.from(Array(deck).keys()).map((card, index) => (
              <div
                key={card}
                style={{
                  position: "absolute",
                  top: 0,
                  left: "50%",
                  transform: `translateX(-50%)`,
                }}
                onClick={handleDrawCard}
              >
                <CardComponent isBackface={true} key={card} />
              </div>
            ))}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                background: "rgba(255,255,255,0.7)",
                borderRadius: "100%",
                padding: 20,
                fontSize: 30,
                height: 80,
                width: 80,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {deck}
            </div>
          </div>
          <div
            style={{
              position: "relative",
              width: 400,
              height: 300,
              transform: "scale(0.9)",
            }}
          >
            {discardPile.map((card, index) => (
              <div
                key={card.id}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  transform: `translateX(${
                    50 - (index % 3) * -4
                  }%) translateY(${
                    index % 2 ? (index % 3) * -8 : (index % 3) * 8
                  }px) rotate(${
                    index % 2 ? (index % 3) * -4 : (index % 3) * 4
                  }deg)`,
                }}
              >
                {buildDummyCard(card.type)}
              </div>
            ))}
          </div>
        </div>

        {otherPlayers.map((player) => {
          return (
            <CardWrapper position="top">
              {Array.from(Array(hands[player]).keys()).map((card) => (
                <CardComponent
                  isBackface={true}
                  hovering={hovering.includes(card.toString())}
                  key={card}
                />
              ))}
            </CardWrapper>
          );
        })}

        <CardWrapper position="bottom">
          {hand.map((card) => (
            <span
              key={card.id}
              onClick={() => handlePlayCard(card)}
              onMouseEnter={() => handleHover(card.id)}
              onMouseLeave={() => handleUnhover()}
            >
              {buildDummyCard(card.type)}
            </span>
          ))}
        </CardWrapper>
      </div>

      {cardOverlay.length > 0 && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.8",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
          onClick={closeCardOverlay}
        >
          {cardOverlay.map((card) => buildDummyCard(card.type))}
        </div>
      )}

      {loseScreen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.8",
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
            height: "100%",
          }}
          onClick={handleLeaveGame}
        >
          <img src="https://images.unsplash.com/photo-1503963325714-4b88d72d7ada?auto=format&fit=crop&w=800&h=800" />
        </div>
      )}

      {winScreen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.8",
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
            height: "100%",
          }}
          onClick={handleLeaveGame}
        >
          <img src="https://images.unsplash.com/photo-1582036683068-7842b873954e?auto=format&fit=crop&w=800&h=800" />
        </div>
      )}
    </div>
  );
};

export default GamePage;
