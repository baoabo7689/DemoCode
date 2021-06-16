import React from "react";
import styles from "./bola-tangkas.module.scss";
import GameList from "./sub-component/game-list/game-list";
import { GameInfoModel } from "./sub-component/game-info/game-info";
import { Modal, Container, Row, Col } from "reactstrap";
import ResultControl from "./sub-component/result-control/result-control";
import CardModel from "../../common/model/CardModel";
import cloneDeep from "lodash.clonedeep";

type Props = {
  onMessage: Function;
  isProduction: boolean;
  sendMessage: Function;
};

type State = {
  isOpenModal: boolean;
  userOptions: Array<string>;
  inGameData: Array<GameInfoModel>;
  settleData: Array<GameInfoModel>;
  gameId: string;
  userName: string;
  exceptionData: string;
  controlResultData: Array<CardModel>;
};

export default class BolaTangKas extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      isOpenModal: false,
      userOptions: [],
      inGameData: new Array<GameInfoModel>(),
      settleData: new Array<GameInfoModel>(),
      gameId: "",
      userName: "",
      exceptionData: "",
      controlResultData: [
        new CardModel(),
        new CardModel(),
        new CardModel(),
        new CardModel(),
        new CardModel(),
        new CardModel(),
        new CardModel(),
      ],
    };

    this.toggleModal = this.toggleModal.bind(this);
    this.startControlResult = this.startControlResult.bind(this);
  }

  componentDidMount() {
    this.props.onMessage((message) => this.handleData(message));
  }

  handleData(data) {
    if (!!data.list_user) {
      this.setState({
        userOptions: data.list_user,
      });
    }

    if (!!data.ingame_data) {
      const curTime = new Date();
      const settleData = this.state.settleData.filter((data) => Math.abs(curTime.getTime() - data.timeSettle.getTime()) < 5000);
      this.setState({
        settleData: settleData,
      });

      const inGameData = cloneDeep(settleData);
      const { userName, gameId } = this.state;
      const ingame = data.ingame_data;
      Object.values(ingame).forEach((playerData: any) => {
        if (
          playerData.name.includes(userName) &&
          !!playerData.step &&
          !!playerData.roundId &&
          playerData.roundId.toString().includes(gameId)
        ) {
          inGameData.push(this.convertPlayerDataToModel(playerData));
        }
      });

      this.setState({
        inGameData: inGameData,
      });
    }

    if (!!data.adminSettlementResult) {
      const settleData = this.state.settleData;
      const { userName, gameId } = this.state;
      const dataResult = data.adminSettlementResult;
      if (dataResult.name.includes(userName) && dataResult.roundId.toString().includes(gameId)) {
        const data = this.convertPlayerDataToModel(dataResult);
        data.timeSettle = new Date();
        settleData.push(data);
      }

      this.setState({
        settleData: settleData,
      });
    }
  }

  convertPlayerDataToModel(playerData) {
    try {
      const result = new GameInfoModel();
      const cards = playerData.resultType == undefined ? playerData.betTracks[playerData.step].cards : playerData.cards;

      result.id = playerData.roundId;
      result.userName = playerData.name;
      result.step = playerData.step;
      result.timeRemaining = playerData.remainingTime >> 0;
      result.winloss = !!playerData.win ? playerData.win : 0;
      result.sumBet = playerData.step < 4 ? this.calculateSumBetTracks(playerData.betTracks) : playerData.amount;
      result.result = playerData.resultType;
      result.hasColokan = playerData.hasColokan;
      result.hasJoker = playerData.hasJoker;

      for (let i = 0; i < cards.length; i++) {
        result.cards.push(new CardModel(cards[i].rank, cards[i].suit));
        cards[i].isHighlight && result.combination.push(i);
      }

      return result;
    } catch (exception) {
      if (!this.state.exceptionData.includes(`"roundId":${playerData.roundId}`)) {
        this.setState({
          exceptionData: `${this.state.exceptionData} --------- ${JSON.stringify(playerData)}`,
        });
      }

      return new GameInfoModel();
    }
  }

  calculateSumBetTracks(betTracks) {
    let result = 0;

    Object.values(betTracks).forEach((element: any) => {
      result += element.amount;
    });

    return result;
  }

  toggleModal() {
    this.setState({
      isOpenModal: !this.state.isOpenModal,
    });
  }

  startControlResult() {
    this.props.sendMessage({ get_users: true });
    this.toggleModal();
  }

  handleCardChange(cards) {
    this.setState({
      controlResultData: cards,
    });
  }

  renderControlResult() {
    return (
      <Modal className={styles["control-result-modal"]} isOpen={this.state.isOpenModal} toggle={this.toggleModal}>
        <ResultControl
          cards={this.state.controlResultData}
          handleCardChange={() => this.handleCardChange}
          userOption={this.state.userOptions}
          toggleModal={this.toggleModal}
          sendMessage={this.props.sendMessage}
        />
      </Modal>
    );
  }

  handleChangeUserName(event) {
    this.setState({
      userName: event.target.value,
    });
  }

  handleChangeGameId(event) {
    this.setState({
      gameId: event.target.value,
    });
  }

  render() {
    return (
      <div className={styles.main}>
        <div className={styles.monitor}>
          <Container>
            <Row className={styles.header}>
              <h2>Bola Tangkas</h2>
              {!this.props.isProduction && (
                <button className="btn-control-result" onClick={this.startControlResult}>
                  Control Result
                </button>
              )}
            </Row>
            <Row>
              <Col className={styles.filter}>
                <label>Game ID : </label>
                <input type={"text"} onChange={(event) => this.handleChangeGameId(event)}></input>
              </Col>
              <Col className={styles.filter}>
                <label>User Name : </label>
                <input type={"text"} onChange={(event) => this.handleChangeUserName(event)}></input>
              </Col>
              <Col className={styles.action}></Col>
            </Row>
          </Container>
        </div>
        <Container className={styles.wrapper}>
          {!this.props.isProduction && this.renderControlResult()}
          <Row>
            <GameList data={this.state.inGameData} />
          </Row>
        </Container>
        <div className={styles["exception-message"]}>{this.state.exceptionData}</div>
      </div>
    );
  }
}
