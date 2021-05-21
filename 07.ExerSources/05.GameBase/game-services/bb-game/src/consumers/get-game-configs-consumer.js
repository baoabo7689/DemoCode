import MarketManagement from "@nex3/market-management";

/**
 * @typedef {Object} GetGameConfigsOptions
 * @property {import("fish-prawn-crab-pro").Definition} definition
 */

export default class ChangeLanguageConsumer {
  /**
   * @param {GetGameConfigsOptions} options
   */
  constructor(options = {}) {
    this.definition = options.definition;
  }
  /**
   * @param {import("fish-prawn-crab-pro").Player} player
   */
  async consumeAsync(player) {
    const marketManagement = MarketManagement.getInstance();
    const marketConfig = await marketManagement.getGameMarketConfig(this.definition.id, player.session.currency, player.session.language);

    const gameConfig = {
      minBet: marketConfig.minBet,
      maxBet: marketConfig.maxBet,
      maxBetChoices: marketConfig.maxBetChoices,
      odds: marketConfig.odds,
    };

    player.socketClient.emit(this.definition.name, { gameConfig });
  }
}
