import TableProcessBetQueue from "sc-game-base/src/table/crons/table-process-bet-queue";
import Translation from "@nex3/translation";
import { placeBet as placeBetApi } from "sc-base-apis";
import PlaceBetPublisher from "../publishers/place-bet-publisher";
import MarketManagement from "@nex3/market-management";

export default class ProcessBetQueue extends TableProcessBetQueue {
  constructor(definition, gameData, publisher = null) {
    publisher = publisher ?? new PlaceBetPublisher(definition.name, gameData);

    super(definition, gameData, publisher);
  }

  /**
   * @param {import("fish-prawn-crab-pro").Player} player
   * @param {import("cron").BetPayload} payload
   */
  async proceedBet(player, payload) {
    const betInfo = {
      amount: Object.values(payload?.bet ?? {}).reduce((total, amount) => total + amount, 0),
      gameId: this.definition.id,
      gameRoundId: this.gameData.roundId,
    };

    const userInfo = {
      id: player.UID,
      session: player.session,
    };

    const apiResult = await placeBetApi(userInfo, betInfo);

    if (apiResult.isOk) {
      await this.handleSuccessBet(player, apiResult.response, betInfo.gameRoundId, payload.bet);
    } else {
      const translation = Translation.getInstance(player?.session?.language);
      const insufficientNotice = translation.t(translation.keys.notEnoughMoney);
      const notice = apiResult.response.inSufficientBalance ? insufficientNotice : apiResult.response;

      this.handleFailedBet(player, notice, payload.bet);
    }
  }

  /**
   * @param {import("fish-prawn-crab-pro").Player} player
   * @param {{red: number}} balance
   * @param {number} roundId
   * @param {Record<string, number>} bet
   */
  async handleSuccessBet(player, balance, roundId, bet) {
    if (this.definition.betLogRepository) {
      this.insertBetLog(this.definition.betLogRepository, player, roundId, bet);
    }

    await this.insertOrUpdateBet(player, roundId, bet);
    await this.adjustGameData(player, bet, balance);

    this.notifyPlacingBetResult(player, balance, bet);
  }

  /**
   * @param {import("mongoose").Model} betLogRepository
   * @param {import("fish-prawn-crab-pro").Player} player
   * @param {number} roundId
   * @param {Record<string, number>} bet
   */
  async insertBetLog(betLogRepository, player, roundId, bet) {
    const newBetLog = {
      uid: player.UID,
      name: player.profile.name,
      round: roundId,
      time: new Date(),
      bet,
    };

    if (player.session) {
      newBetLog.memberId = player.session.memberId;
      newBetLog.siteId = player.session.siteId;
    }

    await betLogRepository.create(newBetLog);
  }

  /**
   * @param {import("fish-prawn-crab-pro").Player} player
   * @param {number} roundId
   * @param {Record<string, number>} bet
   * @this {import("fish-prawn-crab-pro").BaseConsumer || this}
   */
  async insertOrUpdateBet(player, roundId, bet) {
    const freeBet = bet.freeBet || false;
    const existingBetFilter = { uid: player.UID, phien: roundId, freeBet };
    const configs = this.gameData.gameConfigs;
    const newBet = {
      uid: player.UID,
      name: player.profile.name,
      phien: roundId,
      time: new Date(),
      odds: configs.odds,
      freeBet,
    };
    const totalBet = Object.values(bet).reduce((total, betValue) => total + betValue, 0);
    const existingBetIncrement = { ...bet, totalBet };

    if (player.session) {
      newBet.memberId = player.session.memberId;
      newBet.siteId = player.session.siteId;
    }

    await this.definition.betRepository.updateOne(
      existingBetFilter,
      { $inc: existingBetIncrement, $setOnInsert: newBet },
      { upsert: true, setDefaultsOnInsert: true }
    );
  }

  /**
   * @param {import("fish-prawn-crab-pro").Player} player
   * @param {Record<string, number>} bet
   * @param {{red: number}} balance
   * @this {import("fish-prawn-crab-pro").BaseConsumer || this}
   */
  async adjustGameData(player, bet, balance) {
    const marketManagement = MarketManagement.getInstance();
    const playerMarket = await marketManagement.getMarketByCurrency(player.session?.currency);
    const currencyRate = playerMarket?.rate ?? 1;

    Object.entries(bet).forEach((entry) => {
      const [betChoice, amount] = entry;

      this.gameData.totalBets[betChoice] = (this.gameData.totalBets[betChoice] ?? 0) + amount * currencyRate;

      if (this.gameData.chips) {
        this.gameData.chips[betChoice] = this.gameData.chips[betChoice] ?? {};
        this.gameData.chips[betChoice][amount] = (this.gameData.chips[betChoice][amount] ?? 0) + 1;
      }

      if (this.gameData.players[player.UID]) {
        this.gameData.players[player.UID].red = balance.red;
      }
    });
  }

  /**
   * @param {import("fish-prawn-crab-pro").Player} player
   * @param {{red: number}} balance
   * @param {Record<string, number>} bet
   */
  notifyPlacingBetResult(player, balance, bet) {
    const result = this.generatePlacingBetResult(player, balance, bet);

    this.publisher.publishSuccessBet(player.UID, result);
  }

  /**
   * @param {import("fish-prawn-crab-pro").Player} player
   * @param {{red: number}} balance
   * @param {Record<string, number>} bet
   * @this {import("fish-prawn-crab-pro").BaseConsumer || this}
   */
  generatePlacingBetResult(player, balance, bet) {
    const { betTracks, currency } = this.gameData.ingame[player.profile.name];

    return {
      ownBets: betTracks,
      endBet: Object.values(bet).reduce((total, amount) => (total >> 0) + amount),
      user: { ...balance, currency },
      ownChip: bet,
    };
  }

  handleFailedBet(player, notice, bet) {
    Object.entries(bet).forEach(([betChoice, amount]) => {
      if (this.gameData.ingame?.[player.profile.name]) {
        const playerInGame = this.gameData.ingame[player.profile.name];

        if (playerInGame.betTracks[betChoice]) {
          playerInGame.betTracks[betChoice] -= amount;
        }
      }
    });

    super.handleFailedBet(player, notice);
  }
}
