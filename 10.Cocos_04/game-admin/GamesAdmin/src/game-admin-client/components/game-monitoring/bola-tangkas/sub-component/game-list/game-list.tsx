import React from "react";
import styles from "./game-list.module.scss";
import GameInfo, { GameInfoModel } from "../game-info/game-info";
import { Container, Row, Col } from "reactstrap";

function renderGameInfo(data: Array<GameInfoModel>) {
  const result = [];

  data.forEach((info) => {
    result.push(<GameInfo key={`${info.id}-${info.step}`} info={info} />);
  });

  return result;
}

function renderColumns() {
  const result = [
    <Col key="gameid" lg={1}>
      Game ID
    </Col>,
    <Col key="username" lg={2}>
      User Name
    </Col>,
    <Col key="time" lg={2}>
      Time
    </Col>,
    <Col key="bets" lg={1}>
      Bets
    </Col>,
    <Col key="cards" lg={4}>
      Cards
    </Col>,
    <Col key="result" lg={2}>
      Result
    </Col>,
  ];

  return result;
}

export default function GameList(props: { data: Array<GameInfoModel> }) {
  return (
    <Container className={styles.wrapper}>
      <Container>
        <Row className={styles["col-title"]}>{renderColumns()}</Row>
      </Container>
      <div className={styles["game-list"]}>{renderGameInfo(props.data)}</div>
    </Container>
  );
}
