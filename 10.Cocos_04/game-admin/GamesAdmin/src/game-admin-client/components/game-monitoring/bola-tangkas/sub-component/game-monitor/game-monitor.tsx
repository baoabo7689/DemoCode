import React from "react";
import styles from "./game-monitor.module.scss";
import CardModel from "../../../../common/model/CardModel";
import Card from "../../../../shared/card/card";
import { Row } from "reactstrap";

type Props = {
  cards: Array<CardModel>;
  highlightCards: Array<number>;
};

export default function GameMonitor(props: Props) {
  const renderCard = (cards) => {
    const result = [];
    let index = 0;

    cards.forEach((card) => {
      result.push(
        <div className={`${styles["card-container"]} ${props.highlightCards.includes(index) ? styles.highlight : ""}`}>
          <Card key={index++} value={card.value} suit={card.suit} size={"card-sm"} />
        </div>
      );
    });

    return result;
  };

  return <Row className={styles.wrapper}>{renderCard(props.cards)}</Row>;
}
