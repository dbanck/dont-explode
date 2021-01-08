import React from "react";
import styles from "./Card.module.css";

export interface ICardFrontProps {
  title: string;
  description: string;
  imageUrl: string;
}

const CardFront: React.FC<ICardFrontProps> = ({
  title,
  description,
  imageUrl,
}) => {
  return (
    <>
      <div className={styles.image}>
        <img src={imageUrl} />
      </div>
      <div className={styles.title}>{title}</div>
      <div className={styles.description}>
        <div>{description}</div>
      </div>
    </>
  );
};

export default CardFront;
