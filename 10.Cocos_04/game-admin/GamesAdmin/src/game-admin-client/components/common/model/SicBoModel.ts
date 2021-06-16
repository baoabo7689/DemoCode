import TimeModel from "./TimeModel";
import { GameState } from "../../shared/common/GameState";
import BetList from "./BetList";
import DiceModel from "../model/DiceModel";

export class SicBoBetList {
  oddEven: BetList;
  bigSmall: BetList;
  specificTriple: BetList;
  anyTriple: BetList;
  specificDouble: BetList;
  totalPoint: BetList;
  diceCombination: BetList;
  singleDice: BetList;

  constructor() {
    this.singleDice = new BetList();
    this.diceCombination = new BetList();
    this.totalPoint = new BetList();
    this.specificDouble = new BetList();
    this.anyTriple = new BetList();
    this.specificTriple = new BetList();
    this.oddEven = new BetList();
    this.bigSmall = new BetList();
  }
}

export class SicBoUserBetInfo {
  userName: string;
  betList: SicBoBetList;

  constructor() {
    this.userName = "";
    this.betList = new SicBoBetList();
  }
}

export class SicBoBetListSummary {
  oddEven: number;
  bigSmall: number;
  specificTriple: number;
  anyTriple: number;
  specificDouble: number;
  totalPoint: number;
  diceCombination: number;
  singleDice: number;

  constructor() {
    this.singleDice = 0;
    this.diceCombination = 0;
    this.totalPoint = 0;
    this.specificDouble = 0;
    this.anyTriple = 0;
    this.specificTriple = 0;
    this.oddEven = 0;
    this.bigSmall = 0;
  }
}

export default class SicBoModel {
  roundNumber: number;
  time: TimeModel;
  result: Array<DiceModel>;
  nextRoundResult: Array<DiceModel>;
  gameState: number;
  isShowResultUpdater: boolean;
  userBetList: Array<SicBoUserBetInfo>;
  betListSummary: SicBoBetListSummary;
  currentDiceNumber: number;
  isHandleNextRoundResult: boolean;

  constructor() {
    this.currentDiceNumber = -1;
    this.result = [new DiceModel(), new DiceModel(), new DiceModel()];
    this.time = new TimeModel();
    this.gameState = GameState.none;
    this.isShowResultUpdater = false;
    this.userBetList = new Array<SicBoUserBetInfo>();
    this.betListSummary = new SicBoBetListSummary();
    this.nextRoundResult = [new DiceModel(), new DiceModel(), new DiceModel()];
    this.isHandleNextRoundResult = false;
  }
}
