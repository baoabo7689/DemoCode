export default class BetItem {
  name: string;
  bet: number;
  time: string;
  choice: string;
  isWin: boolean;

  constructor(name: string = "", bet: number = 0, time: string = "", choice = "", isWin = false) {
    this.name = name;
    this.bet = bet;
    this.time = time;
    this.choice = choice;
    this.isWin = isWin;
  }
}
