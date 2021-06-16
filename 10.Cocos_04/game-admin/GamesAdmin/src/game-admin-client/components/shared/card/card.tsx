import React from "react";
import styles from "./card.module.scss";
import CardModel, { SuitEmojis } from "../../common/model/CardModel";

export default function Card(props: CardModel) {
  const { value, suit, size } = props;

  const getCard = (value) => {
    let result = "";

    switch (value) {
      case 0:
        result = "A";
        break;
      case 13:
        result = "JOK";
        break;
      case 12:
        result = "K";
        break;
      case 11:
        result = "Q";
        break;
      case 10:
        result = "J";
        break;
      default:
        result = value + 1;
    }

    return result;
  };

  const getColor = (suit) => {
    if ([0, 1, 4].includes(suit)) {
      return "red";
    }

    return "black";
  };

  const renderCard = (value, suit) => {
    if (value == undefined || value == -1) {
      return (
        <div className={`${styles.card} ${styles[size]}`}>
          <div className={styles.back}></div>
        </div>
      );
    } else {
      return (
        <div className={`${styles.card} ${styles[getColor(suit)]} ${styles[size]}`}>
          <span className={styles["card-title"]}>{getCard(value)}</span>
          {value != 13 ? (
            <div className={styles["card-suit"]}>{SuitEmojis[suit]}</div>
          ) : (
            <img className={styles["joker-suit"]} src={"/game-admin/images/card/joker.png"}></img>
          )}
        </div>
      );
    }
  };

  return renderCard(value, suit);
}
