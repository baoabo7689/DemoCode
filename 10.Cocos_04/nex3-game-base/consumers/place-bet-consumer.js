import { helpers } from "sc-common";
import { Core } from "sc-game-base";
import MarketManagement from "@nex3/market-management";
import Translation from "@nex3/translation";

export default class PlaceBetConsumer extends Core.BaseEventConsumers.PlaceBetConsumer {
    composeBettingTimeValidationCriteria(player) {
        const configs = this.gameData.gameConfigs;
        const shakeThePlateTime = this.definition.durations.placingBets + this.definition.durations.shakeThePlateDuration;

        const translation = Translation.getInstance(player?.session?.language);
        return [
            {
                failure: !configs.enabled,
                notice: configs.disabled_message,
            },
            {
                failure:
                    this.gameData.remainingTime >= this.definition.durations.placingBets &&
                    this.gameData.remainingTime <= shakeThePlateTime,
                notice: translation.t(translation.keys.cannotBetAtTheMoment),
            },
            {
                failure:
                    this.gameData.remainingTime < this.definition.durations.lockingBet || this.gameData.remainingTime > shakeThePlateTime,
                notice: translation.t(translation.keys.betOnNextRound),
            },
        ];
    }

    async composeBetAmountValidationCriteria(player, betChoice, amount) {
        const marketManagement = MarketManagement.getInstance();

        const configs = await marketManagement.getGameMarketConfig(this.definition.id, player.session.currency, player?.session?.language);
        const maxBetPerChoice = configs.maxBetChoices[betChoice] || 0;

        const betTracks = this.gameData?.ingame[player.profile.name]?.betTracks ?? {};
        const totalAmount = this.definition.choices.reduce(
            (total, choice) => total + (betTracks[choice] || 0) + (betChoice === choice ? amount : 0),
            0
        );

        const translation = Translation.getInstance(player?.session?.language);
        const formatNumberWithComma = helpers.numberHelper.formatNumberWithComma;

        return [
            {
                failure: amount > maxBetPerChoice || betTracks[betChoice] + amount > maxBetPerChoice,
                notice: translation.t(translation.keys.totalMaxBet, { max: formatNumberWithComma(maxBetPerChoice) }),
            },
            {
                failure: amount < configs.minBet,
                notice: translation.t(translation.keys.minBet, { max: formatNumberWithComma(configs.minBet) }),
            },
            {
                failure: amount > configs.maxBet,
                notice: translation.t(translation.keys.maxBet, { max: formatNumberWithComma(configs.maxBet) }),
            },
            {
                failure: !this.definition.choices.includes(betChoice),
                notice: translation.t(translation.keys.invalidBetChoice),
            },
            {
                failure: totalAmount > configs.maxBet,
                notice: translation.t(translation.keys.maxBet, { max: formatNumberWithComma(configs.maxBet) }),
            },
        ];
    }

    async composeValidationCriteria(player, betChoice, amount, freeBet) {
        const bettingTimeValidationCriteria = this.composeBettingTimeValidationCriteria(player) ?? [];
        const betAmountValidationCriteria = (await this.composeBetAmountValidationCriteria(player, betChoice, amount, freeBet)) || [];
        const betChoiceValidationCriteria = this.composeBetChoiceValidationCriteria(betChoice) || [];

        return bettingTimeValidationCriteria.concat(betAmountValidationCriteria, betChoiceValidationCriteria);
    }

    async validateBetRequest(player, betChoice, amount, freeBet) {
        if (!amount || !betChoice) {
            return false;
        }

        const criteria = await this.composeValidationCriteria(player, betChoice, amount, freeBet);
        const failedCriterion = criteria.find((criterion) => criterion.failure);
        if (failedCriterion) {
            this.publisher.publishToUser(player.UID, { endBet: -1, betChoice, notice: failedCriterion.notice });

            return false;
        }

        return true;
    }

    async consume(player, payload) {
        Object.assign(payload, {
            amount: payload.amount >> 0,
            freeBet: payload.freeBet ?? false,
            roundId: this.gameData.roundId,
        });

        const { amount, betChoice, freeBet } = payload;
        const name = player.profile.name;

        if (!(await this.validateBetRequest(player, betChoice, amount, freeBet))) {
            return;
        }

        if (!this.gameData.ingame[name]) {
            const newPlayer = {
                name: player.profile.name,
                currency: player.session.currency,
                system: player.session.system,
                betTracks: {},
                betQueue: [],
            };

            this.gameData.ingame[name] = newPlayer;
        }

        this.adjustBetTracks(player.profile.name, payload);

        this.gameData.ingame[name].betQueue.push({ player, payload });
    }
}
