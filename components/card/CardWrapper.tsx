import React from "react";

import styles from "./CardWrapper.module.css";

export interface ICardWrapperProps {
  position: "bottom" | "top";
  playersTurn: boolean;
}

const CardWrapper: React.FC<ICardWrapperProps> = ({
  children,
  position,
  playersTurn,
}) => {
  return (
    <div
      className={`${styles.cardWrapper} ${
        position !== "bottom" ? styles.opponent : ""
      } ${playersTurn ? styles.playersTurn : ""}`}
      style={
        position === "bottom"
          ? {
              bottom: (30 + React.Children.count(children) / 4) * 10,
            }
          : {
              top: 120,
              transform: "rotate(180deg)",
            }
      }
    >
      {React.Children.map(children, (Child, index) => {
        return (
          <div
            key={index}
            style={{
              left: `${50 - (React.Children.count(children) / 2 - index) * 6}%`,
              transform: `rotate(${
                (index - React.Children.count(children) / 2) * 2
              }deg) translateX(-30%) translateY(${
                index <= React.Children.count(children) / 2
                  ? -(index - React.Children.count(children) / 2) * 2
                  : (index - React.Children.count(children) / 2) * 2
              }px)`,
              zIndex: position !== "bottom" && 1,
            }}
            className={styles.item}
          >
            {Child}
          </div>
        );
      })}
    </div>
  );
};

export default CardWrapper;
