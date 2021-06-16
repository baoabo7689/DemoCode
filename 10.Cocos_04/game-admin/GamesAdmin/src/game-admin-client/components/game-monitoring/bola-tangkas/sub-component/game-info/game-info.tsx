import React from "react";
import styles from "./game-info.module.scss";
import CardModel from "../../../../common/model/CardModel";
import { Combination } from "../../model/combination";
import GameMonitor from "../game-monitor/game-monitor";
import { Container, Row, Col } from "reactstrap";
import TimeCounter from "../../../../shared/time-counter/time-counter";

class GameInfoModel {
  id: number;
  userName: string;
  timeRemaining: number;
  sumBet: number;
  cards: Array<CardModel>;
  combination: Array<number>;
  result: Combination;
  winloss: number;
  step: number;
  timeSettle: Date;
  hasColokan: boolean;
  hasJoker: boolean;

  constructor() {
    this.cards = new Array<CardModel>();
    this.combination = new Array<number>();
  }
}

export default function GameInfo(props: { info: GameInfoModel }) {
  const getResult = (combinationType: Combination, hasColokan: boolean, hasJoker: boolean) => {
    let result = Combination[combinationType];
    switch (combinationType) {
      case Combination["Royal Flush"]:
      case Combination["Five Of A Kind"]:
      case Combination["Straight Flush"]:
      case Combination["Four Of A Kind"]:
        result = !hasJoker ? `${result} + NJx2` : result;
        break;
      case Combination["Full House"]:
        result = hasColokan ? `${result} + Colokan` : result;
    }

    return result;
  };

  const isWin = (combinationType: Combination) => {
    const winingCase = [
      Combination["Ace Pair"],
      Combination["Five Of A Kind"],
      Combination.Flush,
      Combination["Four Of A Kind"],
      Combination["Full House"],
      Combination["Royal Flush"],
      Combination.Straight,
      Combination["Straight Flush"],
      Combination["Three Of A Kind"],
      Combination["Two Pairs"],
    ];

    return winingCase.includes(combinationType);
  };

  return (
    <Container className={styles.wrapper}>
      <Row className={styles.content}>
        <Col key="id" lg={1}>
          {props.info.id}
        </Col>
        <Col key="name" lg={2}>
          {props.info.userName}
        </Col>
        <Col key="time" lg={2}>
          <TimeCounter remainingTime={props.info.timeRemaining} gameState={1} hhmmssFormat={true} />
        </Col>
        <Col key="sumbet" lg={1}>
          {props.info.sumBet}
        </Col>
        <Col key="monitor" lg={4}>
          <GameMonitor highlightCards={props.info.combination} cards={props.info.cards} />
        </Col>
        <Col key="result" lg={2} className={isWin(props.info.result) ? styles.win : ""}>
          {getResult(props.info.result, props.info.hasColokan, props.info.hasJoker)}
        </Col>
      </Row>
    </Container>
  );
}

export { GameInfoModel };
