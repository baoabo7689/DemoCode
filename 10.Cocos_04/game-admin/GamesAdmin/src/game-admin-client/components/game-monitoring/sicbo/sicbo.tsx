import React from "react";
import styles from "./sicbo.module.scss";
import TimeCounter from "../../shared/time-counter/time-counter";
import TotalBet from "../../shared/total-bet/total-bet";
import { Col, Container, Row, Modal } from "reactstrap";
import GameTemplate from "../game-template/game-template";
import Dice from "../../shared/dice/dice";
import DiceModel from "../../common/model/DiceModel";
import DiceType from "../../common/model/DiceType";
import BetItem from "../../common/model/BetItem";
import SicBoModel, { SicBoUserBetInfo, SicBoBetListSummary } from "../../common/model/SicBoModel";
import RoundNum from "../../shared/round-num/round-num";
import { GameState } from "../../shared/common/GameState";
import TimeModel from "../../common/model/TimeModel";
import BetTable from "./bet-table/bet-table";

type SicBoProps = {
  onMessage: Function;
  sendMessage: Function;
  isProduction: boolean;
};
export default class SicBo extends React.Component<SicBoProps, SicBoModel> {
  constructor(props) {
    super(props);

    this.state = new SicBoModel();
  }

  componentDidMount() {
    this.props.onMessage((message) => this.handleData(message));
  }

  handleData(data) {
    if (data.inGame) {
      this.updateUserBetList(data.inGame);
    }

    if (data.finish) {
      const { userBetList } = this.state;
      const { settlementResult } = data.finish;

      const betListResult = userBetList.map((betInfo) => {
        Object.keys(betInfo.betList).forEach((type) => {
          betInfo.betList[type].dataList.forEach((betItem) => {
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
        time: new TimeModel(11),
        userBetList: betListResult,
      });

      setTimeout(() => {
        const { isHandleNextRoundResult, nextRoundResult } = this.state;
        const result = isHandleNextRoundResult ? nextRoundResult : [new DiceModel(-1), new DiceModel(-1), new DiceModel(-1)];

        this.setState({
          gameState: GameState.running,
          roundNumber: this.state.roundNumber + 1,
          time: {
            remainingTime: 30,
          },
          result: result,
          isHandleNextRoundResult: false,
          betListSummary: new SicBoBetListSummary(),
        });
      }, 11500);
    }

    if (data.roundId) {
      if (data.remainingTime > 30) {
        this.setState({
          gameState: GameState.waiting,
          roundNumber: data.roundId - 1,
          time: {
            remainingTime: data.remainingTime - 30,
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
              remainingTime: 30,
            },
          });
        }, (data.remainingTime - 30) * 1000);
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
        betType: "anyTriple",
        condition: betChoice === "anyTriple",
      },
      {
        betType: "bigSmall",
        condition: betChoice === "big" || betChoice === "small",
      },
      {
        betType: "oddEven",
        condition: betChoice === "odd" || betChoice === "even",
      },
      {
        betType: "specificDouble",
        condition: betChoice.startsWith("double"),
      },
      {
        betType: "specificTriple",
        condition: betChoice.startsWith("triple"),
      },
      {
        betType: "totalPoint",
        condition: betChoice.startsWith("total"),
      },
      {
        betType: "singleDice",
        condition: betChoice.startsWith("single"),
      },
      {
        betType: "diceCombination",
        condition: betChoice.startsWith("combination"),
      },
    ];

    return betChoiceFilter.find((filter) => filter.condition).betType;
  }

  updateUserBetList(data) {
    const betListSummary = new SicBoBetListSummary();
    const userBetList = new Array<SicBoUserBetInfo>();

    for (const userName in data) {
      const { betTracks } = data[userName];
      const userBetInfo = new SicBoUserBetInfo();
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
      userBetList: userBetList,
    });
  }

  toggleModal() {
    this.setState({
      isShowResultUpdater: !this.state.isShowResultUpdater,
    });
  }

  handleChangeResult(id, value) {
    const { currentDiceNumber, roundNumber, gameState } = this.state;

    this.props.sendMessage({
      setResult: {
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

  renderMonitor() {
    const { roundNumber, time, result, gameState, betListSummary } = this.state;

    return (
      <Container className={styles["sicbo-container"]}>
        <Row>
          <Col align="center" className={styles["sicbo-timmer"]}>
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
          <Col align="center" className={styles["sicbo-betList"]}>
            <Row className={styles["row-style"]}>
              <TotalBet type="anyTriple" total={betListSummary.anyTriple}></TotalBet>
              <TotalBet type="bigSmall" total={betListSummary.bigSmall}></TotalBet>
              <TotalBet type="oddEven" total={betListSummary.oddEven}></TotalBet>
              <TotalBet type="specificDouble" total={betListSummary.specificDouble}></TotalBet>
            </Row>
            <Row className={styles["row-style"]}>
              <TotalBet type="specificNumber" total={betListSummary.singleDice}></TotalBet>
              <TotalBet type="specificTriple" total={betListSummary.specificTriple}></TotalBet>
              <TotalBet type="totalPoint" total={betListSummary.totalPoint}></TotalBet>
              <TotalBet type="diceCombination" total={betListSummary.diceCombination}></TotalBet>
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }

  renderBetList() {
    const { userBetList, roundNumber } = this.state;

    return <BetTable betList={userBetList} key={roundNumber}></BetTable>;
  }

  render() {
    return (
      <div>
        {!this.props.isProduction && this.renderGameControl()}
        <GameTemplate renderBetList={this.renderBetList()} renderMonitor={this.renderMonitor()}></GameTemplate>
      </div>
    );
  }
}
