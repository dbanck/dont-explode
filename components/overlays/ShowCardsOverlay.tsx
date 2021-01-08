import React from "react";
import { Card } from "../../contract/events";
import { buildCard } from "../card/factory";

interface IShowCardsOverlayProps {
  closeOverlayCallback: Function | undefined;
  cards: Card[];
}

const ShowCardsOverlay: React.FC<IShowCardsOverlayProps> = ({
  closeOverlayCallback,
  cards,
}) => {
  if (closeOverlayCallback === undefined) return null;

  return (
    <div
      className="fixed top-0 bottom-0 left-0 right-0 bg-black bg-opacity-75 flex justify-center h-full"
      onClick={() => closeOverlayCallback()}
    >
      <div className="flex flex-wrap overflow-auto justify-center py-24 w-2/3">
        <h2 className="text-white text-xl mb-5 w-full text-center">
          Future cards shown in order
        </h2>

        {cards.map((card) => (
          <div key={card.id}>{buildCard(card.type)}</div>
        ))}
      </div>
    </div>
  );
};

export default ShowCardsOverlay;
