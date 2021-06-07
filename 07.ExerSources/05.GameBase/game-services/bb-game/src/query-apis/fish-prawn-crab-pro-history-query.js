import { Core } from "sc-game-base";

export default class FishPrawnCrabProHistoryQuery extends Core.QueryApis.HistoryQuery {
  /**
   * @param player
   * @param {{page: number, pageSize: number, currentRoundId: number}} query
   * @return {Promise<{}|{history: {total: *, betLogs: [], pageSize: number, page: *}}>}
   */
  async queryHistory(player, query) {
    const defaultQuery = { page: 1, pageSize: 1000, currentRoundId: 0 };
    const { page, pageSize, currentRoundId } = Object.assign({}, defaultQuery, query);

    if (page < 1 || !player) {
      return {};
    }

    const roundQuery = currentRoundId !== 0 ? { phien: { $lt: currentRoundId } } : {};
    const filter = Object.assign({ uid: player.UID, thanhtoan: true }, roundQuery);
    const numberOfSkippedBets = (page - 1) * pageSize;
    const total = await this.definition.betRepository.countDocuments(filter).exec();
    const betProjection = {
      _id: false,
      uid: false,
      thanhtoan: false,
      odds: false,
      siteId: false,
      memberId: false,
      __v: false,
      __archive: false,
    };
    const bets = await this.definition.betRepository
      .find(filter, betProjection, { sort: { _id: -1 }, skip: numberOfSkippedBets, limit: pageSize })
      .lean()
      .exec();
    let betLogs = [];

    if (bets && bets.length > 0) {
      betLogs = await Promise.all(
        bets.map(async (bet) => {
          const round = await this.roundQuery.getOne(bet.phien, { _id: false });
          const betLogDetails = this.definition.betLogRepository ? await this.getBetLogDetails(player, bet.phien) : [];

          return {
            ...this.convertBet(bet),
            result: round.result,
            settlementResult: round.settlementResult,
            betLogDetails,
          };
        })
      );
    }

    return { history: { betLogs, page, pageSize, total } };
  }
}
