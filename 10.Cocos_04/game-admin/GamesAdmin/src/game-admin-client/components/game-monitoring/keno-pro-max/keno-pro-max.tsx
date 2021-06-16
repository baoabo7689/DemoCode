import React from 'react';
import styles from './keno-pro-max.module.scss';
import TimeCounter from '../../shared/time-counter/time-counter';
import TotalBet from '../../shared/total-bet/total-bet';
import { Col, Container, Row } from 'reactstrap';
import GameTemplate from '../game-template/game-template';
import BetList from '../../shared/bet-list/bet-list';
import KennoResult from '../../shared/keno-result/keno-result';
import RoundNum from '../../shared/round-num/round-num';
import KenoProMaxModel from '../../common/model/KenoProMaxModel';
import BetItem from '../../common/model/BetItem';
import { GameState } from '../../shared/common/GameState';
import { upperFirstLetter } from '../../util/util';
import KenoResultUpdater from '../../shared/keno-result-updater/keno-result-updater';
import KenoProMaxResult from '../../common/model/KenoProMaxResult';

type Props = {
  onMessage: Function,
  sendMessage: Function,
  isProduction: boolean
};

type State = {
  data: KenoProMaxModel,
  gameState: number;
  isShowResultUpdater: boolean,
  isResultControlled: boolean
};

const TYPES = new Array("big", "small", "odd", "even", "earth", "fire", "gold", "water", "wood");
const TOTAL_TIME = 30;
const WAITING_TIME = 9;

export default class KenoProMax extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);

    this.state = {
      data: new KenoProMaxModel(),
      gameState: GameState.none,
      isShowResultUpdater: false,
      isResultControlled: false
    }

    this.showUpdater = this.showUpdater.bind(this);
    this.updaterToggle = this.updaterToggle.bind(this);
    this.updaterSubmit = this.updaterSubmit.bind(this);
  }

  componentDidMount() {
    this.props.onMessage((message) => this.handleMessage(message));
  }

  handleMessage(message) {
    if (message.remainingTime !== undefined) {
      this.handleStart(message);
    }
    else if (message.finish !== undefined) {
      this.handleStop(message);
    }
    else {
      this.handleBet(message);
    }
  }

  handleStart(message) {
    const newData = new KenoProMaxModel();
    let isFinished = message.remainingTime > TOTAL_TIME;
    newData.time.remainingTime = isFinished ? message.remainingTime - TOTAL_TIME : message.remainingTime;
    newData.roundNumber = isFinished ? message.roundId - 1 : message.roundId;

    this.setState({
      data: newData,
      gameState: isFinished ? GameState.waiting : GameState.running
    });

    if (isFinished) {
      this.countDownToStart.call(this, newData, newData.time.remainingTime + 1);
    }
  }

  handleBet(message) {
    const _this = this;
    const newData = new KenoProMaxModel();
    newData.roundNumber = this.state.data.roundNumber;
    newData.result = this.state.data.result;

    Object.keys(message.ingame).forEach(function (key) {
      const userObj = message.ingame[key];
      TYPES.forEach(type => {
        if (userObj[type] > 0) {
          newData[type].dataList.unshift(_this.getBet(type, userObj));
        }
      });
    });

    TYPES.forEach(type => {
      newData[type].total = newData[type].dataList.reduce((sum, x) => sum + x.bet, 0);
    });

    this.setState({
      data: newData
    });
  }

  handleStop(message) {
    const newData = this.state.data;
    newData.roundNumber = message.finish.roundId;
    newData.result = new KenoProMaxResult(message.finish.result, message.finish.settlementResult);
    newData.time.remainingTime = WAITING_TIME;

    this.setState({
      data: newData,
      gameState: GameState.waiting,
    });

    this.countDownToStart.call(this, newData, WAITING_TIME + 1);
  }

  countDownToStart(newData, time) {
    setTimeout(() => {
      newData.time.remainingTime = TOTAL_TIME;
      newData.roundNumber += 1;
      newData.result = this.state.isResultControlled ? this.state.data.result : new KenoProMaxResult();

      this.setState({
        data: newData,
        gameState: GameState.running,
        isResultControlled: false
      })
    }, time * 1000);
  }

  getBet(type, userObj) {
    const betItem = new BetItem();
    betItem.name = userObj.name;
    betItem.bet = userObj[type];

    return betItem;
  }

  showUpdater() {
    this.setState({
      isShowResultUpdater: true
    })
  }

  updaterToggle() {
    this.setState({
      isShowResultUpdater: !this.state.isShowResultUpdater
    })
  }

  updaterSubmit(list, settlementResult) {
    const obj = {
      setResult: {
        result: list,
        roundId: this.state.gameState == GameState.running ? this.state.data.roundNumber : this.state.data.roundNumber + 1
      }
    }

    const newData = this.state.data;
    newData.result = new KenoProMaxResult(list, settlementResult);
    this.setState({
      isShowResultUpdater: false,
      isResultControlled: this.state.gameState === GameState.waiting,
      data: newData
    })
    this.props.sendMessage(obj);
  }

  checkWinner(betType) {
    const result = this.state.data.result.settlementResult;

    return this.state.gameState === GameState.waiting ? result.split(' - ').includes(betType.toUpperCase()) : false;
  }

  renderMonitor() {
    return (
      <Container>
        <Row>
          <Col className='col-12 col-lg-4'>
            <Row className='justify-content-center'>
              <div className={styles.timecounter}>
                <TimeCounter remainingTime={this.state.data.time.remainingTime} gameState={this.state.gameState} key={this.state.gameState}></TimeCounter>
                <RoundNum roundNumber={this.state.data.roundNumber} />
                <div className={styles['result-sum']}>
                  {this.state.data.result.resultSumText}
                </div>
              </div>
              <div onClick={this.showUpdater}>
                <KennoResult listResult={this.state.data.result.result}></KennoResult>
                <div className={styles['setttlement-result']}>
                  {this.state.data.result.settlementResult}
                </div>
              </div>
            </Row>
          </Col>
          <Col className='p-0 col-12 col-lg-8'>
            <Row className={styles['row-style']}>
              <TotalBet type='kenogold' total={this.state.data.gold.total} isWin={this.checkWinner('gold')} />
              <TotalBet type='kenowood' total={this.state.data.wood.total} isWin={this.checkWinner('wood')} />
              <TotalBet type='kenowater' total={this.state.data.water.total} isWin={this.checkWinner('water')} />
              <TotalBet type='kenofire' total={this.state.data.fire.total} isWin={this.checkWinner('fire')} />
              <TotalBet type='kenoearth' total={this.state.data.earth.total} isWin={this.checkWinner('earth')} />
            </Row>
            <Row className={styles['row-style']}>
              <TotalBet type='kenobig' total={this.state.data.big.total} isWin={this.checkWinner('big')} />
              <TotalBet type='kenosmall' total={this.state.data.small.total} isWin={this.checkWinner('small')} />
              <TotalBet type='kenoodd' total={this.state.data.odd.total} isWin={this.checkWinner('odd')} />
              <TotalBet type='kenoeven' total={this.state.data.even.total} isWin={this.checkWinner('even')} />
            </Row>
          </Col>
        </Row>
      </Container>
    )
  }

  renderBetList() {
    const result = [];
    const _this = this;
    TYPES.forEach(function (type, i) {
      result.push((
        <Col className={styles['keno-betlist']} key={i}>
          <BetList type="onecolumn" isWin={_this.checkWinner(type)} titles={[<div>{_this.renderTitle(upperFirstLetter(type))}</div>]} dataList={_this.state.data[type].dataList} />
        </Col>
      ));
    })

    return (
      <React.Fragment>
        {result}
      </React.Fragment>
    )
  }

  renderTitle(value) {
    return <span className={styles['keno-title']}>{value}</span>
  }

  render() {
    return (
      <div>
        <GameTemplate renderMonitor={this.renderMonitor()} renderBetList={this.renderBetList()} />
        ${!this.props.isProduction && (<KenoResultUpdater modal={this.state.isShowResultUpdater} toggle={this.updaterToggle} submit={this.updaterSubmit} />)}
      </div>
    );
  }
}
