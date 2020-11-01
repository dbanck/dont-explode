import React from "react";
import styles from "./Card.module.css";

import CardFront from "./CardFront";

// TODO! make this OR that props with never
export interface ICardProps {
  isBackface?: boolean;
  title?: string;
  description?: string;
  imageUrl?: string;
  additionalClass?: string;
}

const Card: React.FC<ICardProps> = ({
  isBackface = false,
  title,
  description,
  imageUrl,
  additionalClass = "",
}) => {
  return (
    <div
      className={`card ${styles.container} ${
        isBackface ? `${styles.backface} noScale` : ""
      } ${additionalClass}`}
    >
      {!isBackface && (
        <CardFront
          title={title}
          description={description}
          imageUrl={imageUrl}
        />
      )}
    </div>
  );
};

export default Card;
