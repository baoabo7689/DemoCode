import BaseActionConsumer from "./base-action-consumer";
import MarketManagement from "@nex3/market-management";
import Translation from "@nex3/translation";
import languages from "../resources/translation/languages";
import { helpers } from "sc-common";
import { convertAdminConfigToChoices } from "../helpers/choice-helper";


export default class PlaceBetConsumer extends BaseActionConsumer {
    async composeActionValidationCriteria(player, payload) {
        const marketManagement = MarketManagement.getInstance();
        const translation = Translation.getInstance(player?.session?.language, languages);
        const configs = await marketManagement.getGameMarketConfig(this.definition.id, player.session.currency, player?.session?.language);
        const betTracks = this.gameData?.ingame[player.profile.name]?.betTracks ?? {};
        const totalAmount = this.definition.choices.reduce((total, choice) => total + (betTracks[choice] || 0) + (payload.bet[choice] || 0), 0);
        const maxBetConfigs = convertAdminConfigToChoices(configs.maxBetChoices);
        const formatNumberWithComma = helpers.numberHelper.formatNumberWithComma;

        return [       
            {
                failure:
                this.gameData.remainingTime < this.definition.durations.lockingBet ||
                this.gameData.remainingTime >= this.definition.durations.placingBets,
                notice: translation.t(translation.keys.betOnNextRound),
            },
            ...Object.entries(payload.bet).flatMap((bet) => {
                const [betChoice, amount] = bet;
                const maxBetPerChoice = maxBetConfigs[betChoice] || 0;

                return [
                {
                    failure: amount > maxBetPerChoice || betTracks[betChoice] + amount > maxBetPerChoice,
                    notice: translation.t(translation.keys.maxBetChoice, { max: formatNumberWithComma(maxBetPerChoice) }),
                },
                {
                    failure: amount < configs.minBet,
                    notice: translation.t(translation.keys.minBet, { min: formatNumberWithComma(configs.minBet) }),
                },
                {
                    failure: amount > configs.maxBet,
                    notice: translation.t(translation.keys.maxBet, { max: formatNumberWithComma(configs.maxBet) }),
                },
                {
                    failure: !this.definition.choices.includes(betChoice),
                    notice: translation.t(translation.keys.invalidBetChoice),
                },
                ];
            }),
            {
                failure: totalAmount > configs.maxBet,
                notice: translation.t(translation.keys.maxBet, { max: formatNumberWithComma(configs.maxBet) }),
            },
        ];
    }

    async consume(player, payload) {
        await super.consume(player, payload);
    }
}
