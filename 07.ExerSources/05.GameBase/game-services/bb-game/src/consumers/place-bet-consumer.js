import { helpers, logger } from "sc-common";
import BasePlaceBetConsumer from "sc-game-base/src/core/event-consumers/place-bet-consumer";
import Translation from "@nex3/translation";
import { convertAdminConfigToChoices } from "../helpers/choice-helper";
import MarketManagement from "@nex3/market-management";

export default class PlaceBetConsumer extends BasePlaceBetConsumer {
  /**
   * @param {Record<string, number>} bet
   * @returns {Record<string, number>}
   * @this {import("fish-prawn-crab-pro").BaseConsumer || this}
   */
  normalizeBetPayload(bet) {
    const choices = this.definition.choices;
    return choices.reduce((result, choice) => {
      if (bet[choice]) {
        const amount = bet[choice] >> 0;
        amount > 0 && (result[choice] = amount);
      }

      return result;
    }, {});
  }

  /**
   * @param {import("fish-prawn-crab-pro").Player} player
   * @param {import("cron").BetPayload} payload
   * @this {import("fish-prawn-crab-pro").BaseConsumer || this}
   */
  async consume(player, payload) {
    Object.assign(payload, { bet: this.normalizeBetPayload(payload?.bet ?? {}) });

    try {
      const success = await this.validateBetRequest(player, payload);
      if (success) {
        const name = player.profile.name;
        if (!this.gameData.ingame[name]) {
          this.gameData.ingame[name] = {
            name,
            currency: player.session.currency,
            betTracks: {},
            betQueue: [],
          };
        }

        this.adjustBetTrack(name, payload.bet);
        this.gameData.ingame[name].betQueue.push({ player, payload });
      }
    } catch (error) {
      logger.logError(error);
    }
  }

  /**
   * @param {string} userName
   * @param {Record<string, number>} bet
   */
  adjustBetTrack(userName, bet) {
    Object.entries(bet).forEach(([betChoice, amount]) => {
      if (this.gameData.ingame?.[userName]) {
        const playerInGame = this.gameData.ingame[userName];
        playerInGame.betTracks[betChoice] = (playerInGame.betTracks[betChoice] ?? 0) + amount;
      }
    });
  }

  /**
   * @param {import("fish-prawn-crab-pro").Player} player
   * @param {import("cron").BetPayload} payload
   * @this {import("fish-prawn-crab-pro").BaseConsumer || this}
   */
  async validateBetRequest(player, payload) {
    if (!payload?.bet) {
      return false;
    }

    const criteria = await this.composeValidationCriteria(player, payload);
    const failedCriterion = criteria.find((criterion) => criterion.failure);

    if (failedCriterion) {
      this.publisher.publishToUser(player.UID, { endBet: -1, notice: failedCriterion.notice });
    }

    return !failedCriterion;
  }

  /**
   * @param {import("fish-prawn-crab-pro").Player} player
   * @param {import("cron").BetPayload} payload
   * @this {import("fish-prawn-crab-pro").BaseConsumer || this}
   */
  async composeValidationCriteria(player, payload) {
    const language = player?.session?.language;

    const marketManagement = MarketManagement.getInstance();
    const translation = Translation.getInstance(language);

    const configs = await marketManagement.getGameMarketConfig(this.definition.id, player.session.currency, player?.session?.language);
    const betTracks = this.gameData?.ingame[player.profile.name]?.betTracks ?? {};
    const totalAmount = this.definition.choices.reduce((total, choice) => total + (betTracks[choice] || 0) + (payload.bet[choice] || 0), 0);   

    const maxBetConfigs = convertAdminConfigToChoices(configs.maxBetChoices);
    const formatNumberWithComma = helpers.numberHelper.formatNumberWithComma;

    return [
      {
        failure: !configs.enabled,
        notice: configs.disabledMessage,
      },
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
}
