import BetList from './BetList'
import TimeModel from './TimeModel'
import KenoProMaxResult from './KenoProMaxResult';

export default class KenoProMaxModel {
    roundNumber: number
    gold: BetList
    wood: BetList
    water: BetList
    fire: BetList
    earth: BetList
    big: BetList
    small: BetList
    even: BetList
    odd: BetList
    time: TimeModel
    result: KenoProMaxResult

    constructor() {
        this.result = new KenoProMaxResult();
        this.gold = new BetList();
        this.wood = new BetList();
        this.water = new BetList();
        this.fire = new BetList();
        this.earth = new BetList();
        this.big = new BetList();
        this.small = new BetList();
        this.even = new BetList();
        this.odd = new BetList();
        this.time = new TimeModel();
    }
}