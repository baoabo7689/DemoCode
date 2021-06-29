import BaseInGameConsumer from "sc-game-base/src/core/event-consumers/in-game-consumer";
import MarketManagement from "@nex3/market-management";

export default class InGameConsumer extends BaseInGameConsumer {
    async buildPayload(realPlayer) {
        const marketManagement = MarketManagement.getInstance();
        const marketConfig = await marketManagement.getGameMarketConfig(
            this.definition.id,
            realPlayer.session.currency,
            realPlayer?.session?.language
        );

        const { totalBets } = this.gameData;
        const gameConfigs = {
            minbet: marketConfig.minBet,
            maxbet: marketConfig.maxBet,
            choices_maxbet: marketConfig.maxBetChoices,
            odds: marketConfig.odds,
            enableFreeBet: this.gameData.gameConfigs.enableFreeBet,
        };

        const { betTracks: ownBets } = this.gameData.ingame[realPlayer.profile.name] || { betTracks: {} };
        const roundHistory = await this.roundQuery.getList(this.definition.numberOfRoundHistory);

        await this.getBalance(realPlayer, true);

        const user = await this.getUserInfo(realPlayer.UID);

        return {
            remainingTime: this.gameData.remainingTime,
            gameConfigs,
            roundHistory,
            ownBets,
            totalBets,
            user,
        };
    }
}
