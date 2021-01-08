import React from "react";
import Button from "../common/Button";

interface ISelectPlayerOverlayProps {
  selectPlayerCallback: Function | undefined;
  players: {
    id: string;
    name: string;
  }[];
}

const SelectPlayerOverlay: React.FC<ISelectPlayerOverlayProps> = ({
  selectPlayerCallback,
  players,
}) => {
  if (selectPlayerCallback === undefined) return null;

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-black bg-opacity-75 flex justify-center h-full">
      <div className="flex flex-wrap overflow-auto justify-center py-24 w-2/3">
        <h2 className="text-white text-xl mb-5 w-full text-center">
          Select a player
        </h2>

        {players.map((player) => (
          <div key={player.id} className="m-16">
            <svg
              width="216"
              height="216"
              viewBox="0 0 216 216"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-green-400 mb-2 cursor-pointer hover:text-green-600 transition transition-color duration-200"
              onClick={() => selectPlayerCallback(player.id)}
            >
              <path
                d="M108 108C137.835 108 162 83.835 162 54C162 24.165 137.835 0 108 0C78.165 0 54 24.165 54 54C54 83.835 78.165 108 108 108ZM108 135C71.955 135 0 153.09 0 189V216H216V189C216 153.09 144.045 135 108 135Z"
                fill="currentColor"
              />
            </svg>

            <div className="text-center pr-4 text-xl text-white">
              {player.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectPlayerOverlay;
