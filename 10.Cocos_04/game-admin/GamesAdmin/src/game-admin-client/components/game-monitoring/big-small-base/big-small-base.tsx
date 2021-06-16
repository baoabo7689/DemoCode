import React from "react";
import styles from "./big-small-base.module.scss";
import TimeCounter from "../../shared/time-counter/time-counter";
import TotalBet from "../../shared/total-bet/total-bet";
import { Col, Container, Row, Modal } from "reactstrap";
import GameTemplate from "../game-template/game-template";
import Dice from "../../shared/dice/dice";
import DiceModel from "../../common/model/DiceModel";
import DiceType from "../../common/model/DiceType";
import BetItem from "../../common/model/BetItem";
import BigSmallModel, { BigSmallBetListSummary, BigSmallUserBetInfo } from "../../common/model/BigSmallBaseModel";
import RoundNum from "../../shared/round-num/round-num";
import { GameState } from "../../shared/common/GameState";
import BetTable from "./table-bet/table-bet";

export enum TimeGame {
  timeWaiting = 5,
  turboRemainingTime = 20,
  commonRemainingTime = 30,
}

type BigSmallProps = {
  onMessage: Function;
  sendMessage: Function;
  isProduction: boolean;
  type: string;
  turbo: boolean;
};
export default class BigSmallBase extends React.Component<BigSmallProps, BigSmallModel> {
  constructor(props: Readonly<BigSmallProps>) {
    super(props);
    this.state = new BigSmallModel();
  }

  componentDidMount() {
    this.props.onMessage((message: any) => this.handleData(message));
  }

  handleData(data: {
    inGame: { [x: string]: { betTracks: any } };
    finish: { roundId?: any; result?: any; settlementResult?: any };
    roundId: number;
    remainingTime: number;
    result: { dice1: number; dice2: number; dice3: number };
  }) {
    const { turbo } = this.props;
    const totalRemainingTime = turbo ? TimeGame.turboRemainingTime : TimeGame.commonRemainingTime;
    const totalWaitingTime = TimeGame.timeWaiting;

    if (data.inGame) {
      this.updateUserBetList(data.inGame);
    }

    if (data.finish) {
      const { userBetList } = this.state;
      const { settlementResult } = data.finish;

      const betListResult = userBetList.map((betInfo) => {
        Object.keys(betInfo.betList).forEach((type) => {
          betInfo.betList[type].dataList.forEach((betItem: { isWin: boolean; choice: string | number }) => {
            betItem.isWin = settlementResult[betItem.choice] > 0;
          });
        });

        return betInfo;
      });

      this.setState({
        roundNumber: data.finish.roundId,
        result: [
          new DiceModel(data.finish.result.dice1, DiceType.TaiXiu),
          new DiceModel(data.finish.result.dice2, DiceType.TaiXiu),
          new DiceModel(data.finish.result.dice3, DiceType.TaiXiu),
        ],
        gameState: GameState.waiting,
        time: {
          remainingTime: totalWaitingTime + 1,
        },
        userBetList: betListResult,
      });

      setTimeout(() => {
        const { isHandleNextRoundResult, nextRoundResult } = this.state;
        const result = isHandleNextRoundResult ? nextRoundResult : [new DiceModel(-1), new DiceModel(-1), new DiceModel(-1)];

        this.setState({
          gameState: GameState.running,
          roundNumber: this.state.roundNumber + 1,
          time: {
            remainingTime: totalRemainingTime + 1,
          },
          result: result,
          isHandleNextRoundResult: false,
          betListSummary: new BigSmallBetListSummary(),
        });
      }, (totalWaitingTime + 1) * 1000);
    }

    if (data.roundId) {
      if (data.remainingTime > totalRemainingTime) {
        this.setState({
          gameState: GameState.waiting,
          roundNumber: data.roundId - 1,
          time: {
            remainingTime: data.remainingTime - totalRemainingTime,
          },
          result: [
            new DiceModel(data.result.dice1, DiceType.TaiXiu),
            new DiceModel(data.result.dice2, DiceType.TaiXiu),
            new DiceModel(data.result.dice3, DiceType.TaiXiu),
          ],
        });

        setTimeout(() => {
          this.setState({
            gameState: GameState.running,
            roundNumber: this.state.roundNumber + 1,
            result: this.state.isHandleNextRoundResult
              ? this.state.nextRoundResult
              : [new DiceModel(-1), new DiceModel(-1), new DiceModel(-1)],
            isHandleNextRoundResult: false,
            time: {
              remainingTime: totalRemainingTime,
            },
          });
        }, (data.remainingTime - totalRemainingTime) * 1000);
      } else {
        this.setState({
          gameState: GameState.running,
          roundNumber: data.roundId,
          time: {
            remainingTime: data.remainingTime,
          },
        });
      }
    }
  }

  getBetTypeNameFromChoice(betChoice: string) {
    const betChoiceFilter = [
      {
        betType: "firstBetType",
        condition: betChoice === "odd" || betChoice === "big",
      },
      {
        betType: "secondBetType",
        condition: betChoice === "even" || betChoice === "small",
      },
    ];

    return betChoiceFilter.find((filter) => filter.condition).betType;
  }

  updateUserBetList(data: { [x: string]: { betTracks: any } }) {
    const betListSummary = new BigSmallBetListSummary();
    const userBetList = new Array<BigSmallUserBetInfo>();
    for (const userName in data) {
      const { betTracks } = data[userName];
      const userBetInfo = new BigSmallUserBetInfo();
      userBetInfo.userName = userName;

      for (const betChoice in betTracks) {
        const betType = this.getBetTypeNameFromChoice(betChoice);
        userBetInfo.betList[betType].dataList.push(new BetItem(userName, betTracks[betChoice], "", betChoice));
        userBetInfo.betList[betType].total += betTracks[betChoice];
        betListSummary[betType] += betTracks[betChoice];
      }
     
      userBetList.push(userBetInfo);
    }
    
    this.setState({
      betListSummary: betListSummary,
      userBetList: userBetList
    });
  }

  toggleModal() {
    this.setState({
      isShowResultUpdater: !this.state.isShowResultUpdater,
    });
  }

  handleChangeResult(id: any, value: number) {
    const { currentDiceNumber, roundNumber, gameState } = this.state;

    this.props.sendMessage({
      set_result: {
        roundId: gameState === GameState.waiting ? roundNumber + 1 : roundNumber,
        result: {
          [`dice${+currentDiceNumber + 1}`]: value,
        },
      },
    });

    const newResult = this.state.result;
    newResult[currentDiceNumber] = new DiceModel(value, DiceType.TaiXiu);
    this.setState({
      result: newResult,
      isShowResultUpdater: false,
    });

    if (this.state.gameState == GameState.waiting) {
      const gameResult = this.state.nextRoundResult;
      gameResult[currentDiceNumber] = new DiceModel(value, DiceType.TaiXiu);

      this.setState({
        isHandleNextRoundResult: true,
        nextRoundResult: gameResult,
      });
    }
  }

  openModal(id) {
    this.setState({
      isShowResultUpdater: true,
      currentDiceNumber: id.split("-")[1],
    });
  }

  renderGameControl() {
    const { isShowResultUpdater } = this.state;

    return (
      <Modal isOpen={isShowResultUpdater} toggle={this.toggleModal.bind(this)} className={styles["game-control-panel"]}>
        <Row>
          <Dice diceModel={new DiceModel(1, DiceType.TaiXiu)} isSmall={false} onClickHandle={this.handleChangeResult.bind(this)} />
          <Dice diceModel={new DiceModel(2, DiceType.TaiXiu)} isSmall={false} onClickHandle={this.handleChangeResult.bind(this)} />
          <Dice diceModel={new DiceModel(3, DiceType.TaiXiu)} isSmall={false} onClickHandle={this.handleChangeResult.bind(this)} />
          <Dice diceModel={new DiceModel(4, DiceType.TaiXiu)} isSmall={false} onClickHandle={this.handleChangeResult.bind(this)} />
          <Dice diceModel={new DiceModel(5, DiceType.TaiXiu)} isSmall={false} onClickHandle={this.handleChangeResult.bind(this)} />
          <Dice diceModel={new DiceModel(6, DiceType.TaiXiu)} isSmall={false} onClickHandle={this.handleChangeResult.bind(this)} />
        </Row>
      </Modal>
    );
  }

  getTypeForTotalBet(type: string) {
    switch (type) {
      case "taixiu":
        return { firstLabel: "big", secondLabel: "small" };
      case "chanle":
        return { firstLabel: "le", secondLabel: "chan" };
    }
  }

  renderMonitor() {
    const { turbo } = this.props;
    const turboText = turbo ? "Turbo" : "";
    const { roundNumber, time, result, gameState, betListSummary } = this.state;
    const { type } = this.props;
    const { firstLabel, secondLabel } = this.getTypeForTotalBet(type);
    return (
      <Container>
        <Row>
          <span className={styles.turbo}>
            <div>{turboText}</div>
          </span>
          <Col align="center" className={styles["base-result"]}>
            <TimeCounter remainingTime={time.remainingTime} gameState={gameState} key={gameState} />
            <div>
              <Row className={styles.result}>
                <Dice diceModel={result[0]} isSmall={false} id="dice-0" onClickHandle={this.openModal.bind(this)} />
                <Dice diceModel={result[1]} isSmall={false} id="dice-1" onClickHandle={this.openModal.bind(this)} />
                <Dice diceModel={result[2]} isSmall={false} id="dice-2" onClickHandle={this.openModal.bind(this)} />
              </Row>
              <RoundNum roundNumber={roundNumber} />
            </div>
          </Col>
          <Col align="center" className={styles["flex-col"]}>
            <Row className={styles["row-style"]}>
              <TotalBet type={firstLabel} total={betListSummary.firstBetType}></TotalBet>
              <TotalBet type={secondLabel} total={betListSummary.secondBetType}></TotalBet>
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }

  renderBetList() {
    const { userBetList } = this.state;
    const { type } = this.props;
    return <BetTable type={type} betList={userBetList}></BetTable>;
  }

  render() {
    return (
      <div className={styles.bigsmallturbo}>
        {!this.props.isProduction && this.renderGameControl()}
        <GameTemplate renderBetList={this.renderBetList()} renderMonitor={this.renderMonitor()}></GameTemplate>
      </div>
    );
  }
}
