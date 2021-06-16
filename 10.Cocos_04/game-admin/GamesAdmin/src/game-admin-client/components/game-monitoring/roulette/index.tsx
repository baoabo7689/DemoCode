import React from "react";
import RouletteModel, { RouletteBetListSummary, RouletteUserBetInfo } from "../../common/model/RouletteModel";
import { GameState } from "../../shared/common/GameState";
import GameTemplate from "../game-template/game-template";
import { Container, Row, Col } from "reactstrap";
import TimeCounter from "../../shared/time-counter/time-counter";
import RoundNum from "../../shared/round-num/round-num";
import styles from "./styles.module.scss";
import RouletteResultUpdater from "./result-updater";
import TotalBet from "../../shared/total-bet/total-bet";
import BetItem from "../../common/model/BetItem";
import BetTable from "./bet-table/bet-table";

type Props = {
  onMessage: Function;
  sendMessage: Function;
  isProduction: boolean;
};

const PlacingBetDuration = 35;
const WaitingTime = 14;
const redNumber = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
const blackNumber = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];
export default class Roulette extends React.Component<Props, RouletteModel> {
  private isFirstLoad: boolean;
  private timeout: NodeJS.Timeout;

  constructor(props: Props) {
    super(props);

    this.isFirstLoad = true;
    this.state = new RouletteModel();

    this.updaterToggle = this.updaterToggle.bind(this);
    this.updaterSubmit = this.updaterSubmit.bind(this);
    this.showUpdater = this.showUpdater.bind(this);
  }

  componentDidMount() {
    this.props.onMessage((message) => this.handleData(message));
  }

  showUpdater() {
    this.setState({
      isShowResultUpdater: true,
    });
  }

  updaterToggle() {
    this.setState({
      isShowResultUpdater: !this.state.isShowResultUpdater,
    });
  }

  updaterSubmit(number) {
    const obj = {
      setResult: {
        result: number,
        roundId: this.state.gameState == GameState.running ? this.state.roundNumber : this.state.roundNumber + 1,
      },
    };

    this.setState({
      result: number,
      isShowResultUpdater: false,
    });

    this.props.sendMessage(obj);
  }

  handleData(data) {
    if (!!data.um) {
      if (this.isFirstLoad || this.state.time.remainingTime == PlacingBetDuration) {
        clearTimeout(this.timeout);
        this.setState({
          time: { remainingTime: 0 },
          gameState: GameState.disabled,
          roundNumber: this.isFirstLoad ? this.state.roundNumber : this.state.roundNumber - 1,
          result: -1,
        });
        this.isFirstLoad = false;
      }
    }

    if (!!data.remainingTime) {
      const { roundId, remainingTime, result } = data;
      if (remainingTime > PlacingBetDuration) {
        this.setState({
          gameState: GameState.waiting,
          roundNumber: roundId - 1,
          result: result ? result : this.state.result,
          time: { remainingTime: remainingTime - PlacingBetDuration },
        });

        this.timeout = setTimeout(() => {
          this.setState({
            gameState: GameState.running,
            roundNumber: roundId,
            result: -1,
            time: {
              remainingTime: remainingTime,
            },
          });
        }, (remainingTime - PlacingBetDuration + 1) * 1000);
      } else {
        this.setState({
          gameState: GameState.running,
          roundNumber: roundId,
          result: -1,
          time: { remainingTime: remainingTime },
        });
      }
    }

    if (!!data.finish) {
      const { result, settlementResult } = data.finish;
      const { userBetList } = this.state;

      this.isFirstLoad = false;

      const betListResult = userBetList.map((betInfo) => {
        Object.keys(betInfo.betList).forEach((type) => {
          betInfo.betList[type].dataList.forEach((betItem) => {
            betItem.isWin = settlementResult[type].includes(betItem.choice);
          });
        });

        return betInfo;
      });

      this.setState({
        result: result,
        gameState: GameState.waiting,
        time: { remainingTime: WaitingTime },
        userBetList: betListResult,
      });

      setTimeout(() => {
        this.setState({
          result: -1,
          gameState: GameState.running,
          roundNumber: this.state.roundNumber + 1,
          time: { remainingTime: PlacingBetDuration },
        });
      }, (WaitingTime + 1) * 1000);
    }

    if (!!data.ingame) {
      this.updateBetList(data.ingame);
    }
  }

  updateBetList(data) {
    const betListSummary = new RouletteBetListSummary();
    const userBetList = new Array<RouletteUserBetInfo>();

    for (const user in data) {
      const { name, betTracks } = data[user];
      const userBetInfo = new RouletteUserBetInfo();
      userBetInfo.userName = name;

      Object.keys(betTracks).forEach((type) => {
        const betTrack = betTracks[type];

        Object.keys(betTrack).forEach((choice) => {
          userBetInfo.betList[type].dataList.unshift(new BetItem(name, betTrack[choice], "", choice));
          betListSummary[type] += betTrack[choice];
          userBetInfo.betList[type].total += betTrack[choice];
        });
      });

      userBetList.unshift(userBetInfo);
    }
    this.setState({ betListSummary: betListSummary, userBetList: userBetList });
  }
  renderMonitor() {
    const { time, roundNumber, gameState, betListSummary } = this.state;
    return (
      <Container fluid>
        <Row>
          <div className={styles["game-title"]}>
            <span>Roulette</span>
          </div>
          <Col align="center" className="col-12 col-lg-3">
            <Row className="justify-content-center">
              <div className={styles.timer}>
                <TimeCounter remainingTime={time.remainingTime} gameState={gameState} />
                <RoundNum roundNumber={roundNumber} />
              </div>
              <div onClick={this.showUpdater} className={`${styles.result} ${styles[this.getResultColor(this.state.result)]}`}>
                {this.state.result >= 0 ? this.state.result : ""}
              </div>
            </Row>
          </Col>
          <Col className="p-0 col-12 col-lg-7">
            <Row className={styles["total-bet"]}>
              <TotalBet type="straightUp" total={betListSummary.straightUp} />
              <TotalBet type="split" total={betListSummary.split} />
              <TotalBet type="street" total={betListSummary.street} />
              <TotalBet type="triangle" total={betListSummary.triangle} />
              <TotalBet type="corner" total={betListSummary.corner} />
              <TotalBet type="fourNumbers" total={betListSummary.fourNumbers} />
            </Row>
            <Row className={styles["total-bet"]}>
              <TotalBet type="line" total={betListSummary.line} />
              <TotalBet type="column" total={betListSummary.column} />
              <TotalBet type="dozen" total={betListSummary.dozen} />
              <TotalBet type="redBlack" total={betListSummary.redBlack} />
              <TotalBet type="oddEven" total={betListSummary.oddEven} />
              <TotalBet type="bigSmall" total={betListSummary.bigSmall} />
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }

  renderBetList() {
    const { userBetList, result } = this.state;

    return <BetTable betList={userBetList} key={result}></BetTable>;
  }

  renderTitles(titles: string[]) {
    return (
      <div className={styles["betlist-title"]}>
        {titles.map((title) => (
          <Row align="center" key={title}>
            <span>{title}</span>
          </Row>
        ))}
      </div>
    );
  }

  getResultColor(result) {
    let color = "";

    color = result === 0 ? "green" : color;
    color = redNumber.includes(result) ? "red" : color;
    color = blackNumber.includes(result) ? "black" : color;

    return color;
  }

  render() {
    return (
      <div>
        <GameTemplate
          renderMonitor={this.renderMonitor()}
          renderBetList={this.renderBetList()}
          disabled={this.state.gameState == GameState.disabled}
        />
        {!this.props.isProduction && (
          <RouletteResultUpdater modal={this.state.isShowResultUpdater} toggle={this.updaterToggle} submit={this.updaterSubmit} />
        )}
      </div>
    );
  }
}
