import React from "react";
import styles from "./Card.module.css";

export interface ICardProps {
  title: string;
  description: string;
  imageUrl: string;
}

const Card: React.FC<ICardProps> = ({ title, description, imageUrl }) => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>{title}</div>
      <div className={styles.image}>
        <img src={imageUrl} />
      </div>
      <div className={styles.description}>
        <div>{description}</div>
      </div>
    </div>
  );
};

export default Card;
