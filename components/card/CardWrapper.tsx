import React from "react";

import styles from "./CardWrapper.module.css";

const CardWrapper: React.FC = ({ children }) => {
  return (
    <div
      className={styles.cardWrapper}
      style={{
        transform: `rotate(${-20}deg) translateX(-50%)`,
        transformOrigin: "center",
      }}
    >
      {React.Children.map(children, (Child, index) => {
        return (
          <div
            style={{
              position: "absolute",
              left: 30 * index,
              transform: `rotate(${index * 10}deg)`,
              transformOrigin: "bottom center",
            }}
          >
            {Child}
          </div>
        );
      })}
    </div>
  );
};

export default CardWrapper;
