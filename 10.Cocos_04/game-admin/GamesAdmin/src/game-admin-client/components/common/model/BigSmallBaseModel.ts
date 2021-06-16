import TimeModel from "../../common/model/TimeModel";
import { GameState } from "../../shared/common/GameState";
import BetList from "../../common/model//BetList";
import DiceModel from "../../common/model/DiceModel";

export class BigSmallBetList {
  firstBetType: BetList;
  secondBetType: BetList;

  constructor() {
    this.firstBetType = new BetList();
    this.secondBetType = new BetList();
  }
}

export class BigSmallBetListSummary {
  firstBetType: number;
  secondBetType: number;


  constructor() {
    this.firstBetType = 0;
    this.secondBetType = 0; 
  }
}


export class BigSmallUserBetInfo {
  userName: string;
  betList: BigSmallBetList;

  constructor() {
    this.userName = "";
    this.betList = new BigSmallBetList();
  }
}

export default class BigSmallModel {
  roundNumber: number;
  time: TimeModel;
  result: Array<DiceModel>;
  nextRoundResult: Array<DiceModel>;
  gameState: number;
  isShowResultUpdater: boolean;
  userBetList: Array<BigSmallUserBetInfo>;
  betListSummary: BigSmallBetListSummary;
  currentDiceNumber: number;
  isHandleNextRoundResult: boolean;
  type: string;

  constructor() {
    this.currentDiceNumber = -1;
    this.result = [new DiceModel(), new DiceModel(), new DiceModel()];
    this.time = new TimeModel();
    this.gameState = GameState.none;
    this.isShowResultUpdater = false;
    this.userBetList = new Array<BigSmallUserBetInfo>();
    this.betListSummary = new BigSmallBetListSummary();
    this.nextRoundResult = [new DiceModel(), new DiceModel(), new DiceModel()];
    this.isHandleNextRoundResult = false;
  }
}
