import { Core } from "sc-game-base";
import MarketManagement from "@nex3/market-management";

export default class ProcessBetQueue extends Core.Crons.ProcessBetQueue {
    async proceedBet(player, payload) {
        const betInfo = this.formatApiBetInfo(payload);

        if (!(await this.validateBetRequest(player, payload))) {
            return;
        }

        const apiResult = await this.placeBet({ id: player.UID, session: player.session }, betInfo, this.gameData);
        const { response } = apiResult;

        if (apiResult.isOk) {
            await this.handleSuccessBet(player, response, betInfo.gameRoundId, payload);
        } else {
            await this.handleFailedBet(player, response, payload);

            if (
                (player.profile.minBet !== response.apiError?.minBet || player.profile.maxBet !== response.apiError?.maxBet) &&
                response.apiError?.minBet > 0 &&
                response.apiError?.maxBet > 0
            ) {
                await this.updateUserStakeLevel(player, response.apiError.minBet, response.apiError.maxBet);
            }
        }
    }

    async handleSuccessBet(player, balance, roundId, bet) {
        if (this.betLogsRepository) {
            await this.insertBetLog(player, roundId, bet);
        }

        await this.upsertBet(player, roundId, bet);

        await this.adjustTotalBets(player, bet);

        this.notifyPlacingBetResult(player, balance, bet);

        if (!bet.freeBet && (player.profile.minBet !== balance.minBet || player.profile.maxBet !== balance.maxBet)) {
            await this.updateUserStakeLevel(player, balance.minBet, balance.maxBet);
        }
    }

    async adjustTotalBets(player, bet) {
        const { betChoice, amount } = bet;

        const marketManagement = MarketManagement.getInstance();
        const playerMarket = await marketManagement.getMarketByCurrency(player.session?.currency);
        const currencyRate = playerMarket?.rate ?? 1;

        this.gameData.totalBets[betChoice] = (this.gameData.totalBets[betChoice] ?? 0) + amount * currencyRate;
    }

    async handleFailedBet(player, notice, bet) {
        const { betChoice } = bet;
        await this.decreaseBetTracks(player.profile.name, bet);

        if (notice.apiError) {
            this.placeBetPublisher.publishGameFailedBet(player.UID, { endBet: -1, betChoice, apiError: notice.apiError });
        } else if (notice.kickedOut) {
            this.placeBetPublisher.publishGameFailedBet(player.UID, { endBet: -1, betChoice, kickedOut: notice.kickedOut });
        } else {
            this.placeBetPublisher.publishGameFailedBet(player.UID, { endBet: -1, betChoice, notice });
        }
    }

    async decreaseBetTracks(playerName, bet) {
        const { betChoice, amount } = bet;

        if (this.gameData.ingame?.[playerName]) {
            const playerInGame = this.gameData.ingame[playerName];

            const marketManagement = MarketManagement.getInstance();
            const playerMarket = await marketManagement.getMarketByCurrency(playerInGame.session?.currency);
            const currencyRate = playerMarket?.rate ?? 1;

            playerInGame.betTracks[betChoice] -= amount * currencyRate;
        }
    }
}
