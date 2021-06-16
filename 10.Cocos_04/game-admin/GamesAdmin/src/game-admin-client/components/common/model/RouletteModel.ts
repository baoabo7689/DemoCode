import TimeModel from "./TimeModel";
import { GameState } from "../../shared/common/GameState";
import BetList from "./BetList";

export class RouletteBetList {
  straightUp: BetList;
  split: BetList;
  street: BetList;
  triangle: BetList;
  corner: BetList;
  fourNumbers: BetList;
  line: BetList;
  column: BetList;
  dozen: BetList;
  redBlack: BetList;
  oddEven: BetList;
  bigSmall: BetList;

  constructor() {
    this.straightUp = new BetList();
    this.split = new BetList();
    this.street = new BetList();
    this.triangle = new BetList();
    this.corner = new BetList();
    this.fourNumbers = new BetList();
    this.line = new BetList();
    this.column = new BetList();
    this.dozen = new BetList();
    this.redBlack = new BetList();
    this.oddEven = new BetList();
    this.bigSmall = new BetList();
  }
}

export class RouletteUserBetInfo {
  userName: string; 
  betList: RouletteBetList;

  constructor() {
    this.userName = "";
    this.betList = new RouletteBetList();
  }
}

export class RouletteBetListSummary {
  straightUp: number;
  split: number;
  street: number;
  triangle: number;
  corner: number;
  fourNumbers: number;
  line: number;
  column: number;
  dozen: number;
  redBlack: number;
  oddEven: number;
  bigSmall: number;

  constructor() {
    this.straightUp = 0;
    this.split = 0;
    this.street = 0;
    this.triangle = 0;
    this.corner= 0;
    this.fourNumbers = 0;
    this.line = 0;
    this.column = 0;
    this.dozen = 0;
    this.redBlack = 0;
    this.oddEven = 0;
    this.bigSmall = 0;
  }
}

export default class RouletteModel {
  roundNumber: number;
  time: TimeModel;
  result: number;
  gameState: number;
  isShowResultUpdater: boolean;
  userBetList: Array<RouletteUserBetInfo>;
  betListSummary: RouletteBetListSummary;

  constructor() {
    this.result = -1;
    this.time = new TimeModel();
    this.gameState = GameState.none;
    this.isShowResultUpdater = false;
    this.userBetList = new Array<RouletteUserBetInfo>();
    this.betListSummary = new RouletteBetListSummary();
  }
}
