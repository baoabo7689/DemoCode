import MarketManagement from "@nex3/market-management";

export default class GetGameConfigsConsumer {
  constructor(options = {}) {
    this.definition = options.definition;
  }
  
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
