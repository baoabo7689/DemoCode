import { Core } from "sc-game-base";

import { getSettlementResult } from "../helpers/result-helper";

export default class FishPrawnCrabProRoundQuery extends Core.QueryApis.RoundQuery {
  convertSettlementResult(roundResult) {
    return getSettlementResult(roundResult);
  }

  convertResult(round) {
    const { dice1, dice2, dice3 } = round;

    return { dice1, dice2, dice3 };
  }

  /**
   * @param {string} uid
   */
  async getLatestBet(uid) {
    let roundId = 0;
    let bet = {};

    const betFilter = "-_id -__v -freeBet -memberId -name -odds -siteId -thanhtoan -time -betwin -uid -totalBet";
    const latestBet = await this.definition.betRepository
      .findOne({ uid }, betFilter, { sort: { phien: -1 } })
      .lean()
      .exec();

    if (latestBet) {
      roundId = latestBet?.phien;
      delete latestBet.phien;
      bet = latestBet;
    }

    return { roundId, bet };
  }
}
