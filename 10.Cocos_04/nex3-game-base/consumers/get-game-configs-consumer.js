import MarketManagement from "@nex3/market-management";

export default class GetGameConfigsConsumer {
    constructor({ definition, gameData }) {
        this.definition = definition;
        this.gameData = gameData;
    }

    async consume(player) {
        const marketManagement = MarketManagement.getInstance();
        const marketConfig = await marketManagement.getGameMarketConfig(
            this.definition.id,
            player.session.currency,
            player.session.language
        );
        const { odds } = this.gameData.gameConfigs;

        const gameConfigs = {
            remainingTime: this.gameData.remainingTime,
            minBet: marketConfig.minBet,
            maxBet: marketConfig.maxBet,
            maxBetChoices: marketConfig.maxBetChoices,
            odds,
        };

        player.socketClient.emit(this.definition.name, { gameConfigs });
    }
}
