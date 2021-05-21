export default class AdminSettlementResultConsumer {
  /**
   * @param {Object} options
   * @property gameData
   * @property definition
   */
  constructor(options) {
    this.gameData = options.gameData;
    this.definition = options.definition;
  }

  consume(payload) {
    const result = Object.assign(this.definition.generateResult(), this.gameData.settlementResultFromAdmin?.result ?? {}, payload.result);

    this.gameData.settlementResultFromAdmin = {
      roundId: payload.roundId,
      result,
    };
  }
}
