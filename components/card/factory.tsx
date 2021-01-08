import React from "react";

import { Card, CardType } from "../../contract/events";
import CardComponent from "./Card";

// TODO: make into a component/move logic into Card.tsx
export const buildCard = (type: Card["type"]) => {
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
    case CardType.Favor:
      return (
        <CardComponent
          title="Favor"
          description="One player must give you a card of their choice."
          imageUrl="https://images.unsplash.com/photo-1479271074763-7f7f1b06d771?auto=format&fit=crop&w=300"
        />
      );
  }
};
