import Bot from "sc-game-base/src/table/crons/table-game-bot";
import { convertAdminConfigToChoices } from "../helpers/choice-helper";
import { userInfos } from "sc-base-database";
import Constants from "../constants";
import { helpers } from "sc-common";
import MarketManagement from "@nex3/market-management";
import easingsFunctions from "../helpers/easings-functions";

export default class FishPrawnCrabProBot extends Bot {
  constructor(definition, gameData, publisher) {
    super(definition, gameData, publisher);

    this.popularChoices = [
      { choices: ["ground", "water"], addition: 7 },
      { choices: ["single1", "single2", "single3", "single4", "single5", "single6"], addition: 7 },
    ];
    this.oppositeChoices = {
      ground: "water",
      water: "ground",
    };
  }

  async reset() {
    const configs = this.gameData.gameConfigs;

    if (configs.botenabled) {
      const botRatio = helpers.configHelper.getMaxBotForCurrentHour(configs);

      if (this.currentBotRatio !== botRatio) {
        this.currentBotRatio = botRatio;

        const totalBots = await userInfos.countDocuments({ type: true }).exec();
        this.maxNumberOfBots = Math.floor(totalBots * this.currentBotRatio);
      }

      await this.processDisabledBots();
    } else {
      await this.removeAllBots();
    }

    this.resetAllBotData();
  }

  resetAllBotData() {
    super.resetAllBotData();

    Object.keys(this.gameData.players).forEach((id) => {
      if (this.gameData.players[id].type) {
        this.resetBot(this.gameData.players[id]);
      }
    });
  }

  getBotsToJoin(botUsers) {
    if (this.currentBotRatio === 0) {
      return [];
    }

    const remaining = this.maxNumberOfBots - Object.keys(this.botsInRoom).length;
    const maxBotRandom =
      remaining > 0
        ? Math.min(Math.max(1, this.maxNumberOfBots / this.gameData.remainingTime), remaining)
        : Math.max(1, this.maxNumberOfBots / this.gameData.remainingTime);
    const numberOfBotsToJoin = this.chance.integer({ min: 1, max: maxBotRandom });
    const shuffleBots = this.chance.shuffle(botUsers);

    return shuffleBots.slice(0, numberOfBotsToJoin);
  }

  async joinRoom() {
    const botUsers = await userInfos.find({ type: true, inRoom: false }, "-_id id name red avatarId type").lean().exec();
    const newBots = this.getBotsToJoin(botUsers);

    await Promise.all(newBots.map((bot) => this.botJoinRoom(bot)));
  }

  async botJoinRoom(bot) {
    const marketManagement = MarketManagement.getInstance();
    const baseMarket = await marketManagement.getBaseMarket();
    const botCurrency = baseMarket.currencies[0];

    await userInfos.updateOne({ id: bot.id }, { inRoom: true, inGameRoom: this.definition.configName });

    this.resetBot(bot);

    this.botsInRoom[bot.id] = bot;
    this.gameData.players[bot.id] = Object.assign({}, bot, { currency: botCurrency });

    const payload = {
      player: {
        id: bot.id,
        name: bot.name,
        red: bot.red,
        avatarId: bot.avatarId,
        type: bot.type,
        currency: botCurrency,
      },
    };

    this.publisher.publishToAllUsers(payload);
  }

  async processDisabledBots() {
    const disabledBots = await userInfos.find({ type: true, banned: false }).lean().exec();

    await Promise.all(
      disabledBots.map(async (bot) => {
        if (this.botsInRoom[bot.id]) {
          await this.removeBot(bot.id);
          delete this.botsInRoom[bot.id];
        }
      })
    );
  }

  getArrayHasSameValue(value, size) {
    return [...Array(size >> 0).keys()].map(() => value);
  }

  removeOppositeChoices(bot, choices) {
    const opposite = bot.choices.map((choice) => this.oppositeChoices[choice]).filter((choice) => !!choice);

    return choices.filter((choice) => !opposite.includes(choice));
  }

  getOdds() {
    const oddsConfig = Object.assign({}, this.gameData.gameConfigs.odds, { singleSymbol: this.gameData.gameConfigs.odds.oneSymbol });
    delete oddsConfig.oneSymbol;
    delete oddsConfig.twoSymbol;
    delete oddsConfig.threeSymbol;

    return convertAdminConfigToChoices(oddsConfig);
  }

  getBetChoice(bot) {
    const odds = this.getOdds();

    const maxOdds = Math.max(...Object.values(odds));
    const choicesFlowingOdds = Object.entries(odds)
      .map(([choice, odd]) => this.getArrayHasSameValue(choice, maxOdds / odd))
      .flat();
    const shuffledChoicesFlowingOdds = this.chance.shuffle(choicesFlowingOdds).slice(0, 20);

    const maxOddsOfPopularChoices = Math.max(...this.popularChoices.map((element) => element.choices.map((choice) => odds[choice])).flat());
    const popularChoicesFollowingOdds = this.popularChoices
      .map((element) =>
        element.choices.map((choice) =>
          this.getArrayHasSameValue(choice, element.addition + ((maxOddsOfPopularChoices / odds[choice]) >> 0))
        )
      )
      .flat(2);
    const shuffledPopularChoices = this.chance.shuffle(popularChoicesFollowingOdds).slice(0, 40);

    const choices = this.removeOppositeChoices(bot, shuffledChoicesFlowingOdds.concat(shuffledPopularChoices));
    const random = this.chance.integer({ min: 0, max: choices.length - 1 });

    return choices[random];
  }

  getMaxBet(bot, choice) {
    const maxBetPerChoice = convertAdminConfigToChoices(this.gameData.gameConfigs.choices_maxbet);
    const botMaxBet = this.gameData.gameConfigs.bot_maxbet;

    bot.betOnChoices[choice] = bot.betOnChoices[choice] ?? 0;

    return Math.min(maxBetPerChoice[choice], botMaxBet);
  }

  generatePlaceBetPayload(playerId, choice, amount, balance, currency) {
    return {
      playerChip: { playerId, choices: { [choice]: amount }, red: balance, currency },
    };
  }

  async insertOrUpdateBet(bot, choice, amount) {
    const existingBetIncrement = { totalBet: amount, [choice]: amount };

    const create = {
      uid: bot.id,
      name: bot.name,
      phien: this.gameData.roundId,
      time: new Date(),
    };

    await this.definition.tempBetRepository.updateOne(
      { uid: bot.id, phien: this.gameData.roundId },
      { $setOnInsert: create, $inc: existingBetIncrement },
      { upsert: true, setDefaultsOnInsert: true }
    );
  }

  async placeBet(bot) {
    const choice = this.getBetChoice(bot);
    const maxBet = this.getMaxBet(bot, choice);
    const minBet = this.getMinBet();
    const amount = this.getBetAmount(minBet, maxBet);

    if (this.gameData.remainingTime > this.definition.durations.lockingBet) {
      const currentBet = await this.definition.tempBetRepository.findOne({ uid: bot.id, phien: this.gameData.roundId }).lean().exec();
      const user = await userInfos.findOne({ id: bot.id }, "red").exec();
      let currency = "";

      if (user && user.red > amount) {
        user.red -= amount;
        this.totalTickets += 1;

        await user.save();
        await this.insertOrUpdateBet(bot, choice, amount, currentBet);

        if (this.gameData.players[bot.id]) {
          this.gameData.players[bot.id].red = user.red;
          currency = this.gameData.players[bot.id].currency;
        }

        this.updateTotalBetsAndChips(choice, amount);
        this.updateBotInRoomData(bot, choice, amount, user.red);
        this.publisher.publishToAllUsers(this.generatePlaceBetPayload(bot.id, choice, amount, user.red, currency));
      }
    }
  }

  getBetAmount(minBet, maxBet) {
    const minChip = Math.min(...Constants.chips);
    let chips = Constants.chips
      .filter((chip) => chip >= minBet && chip <= maxBet)
      .sort((a, b) => b - a)
      .map((chip, index) => [...Array(index + 1).keys()].map(() => chip))
      .flat();

    if (!chips.length) {
      return minChip;
    }

    const randomIndex = this.chance.integer({ min: 0, max: chips.length - 1 });

    return chips[randomIndex];
  }

  getBotsToBet() {
    const numberBotsToBet = this.getNumberBotsToPlaceBet();

    let botsToBet = Object.values(this.botsInRoom).filter(
      (t) => t.totalBet < this.gameData.gameConfigs.bot_maxbet && t.remainTickets > 0 && t.red > 0
    );

    botsToBet = this.chance.shuffle(botsToBet);
    botsToBet = botsToBet.slice(0, Math.min(numberBotsToBet, botsToBet.length - 1));

    return botsToBet;
  }

  getNumberBotsToPlaceBet() {
    const remainTickets = Object.values(this.botsInRoom).reduce((total, bot) => total + bot.remainTickets, 0);
    const numbersOfBotInRoom = Object.keys(this.botsInRoom).length;
    const placingBets = this.definition.durations.placingBets - this.definition.durations.lockingBet;
    const remaining = this.gameData.remainingTime - this.definition.durations.lockingBet;
    const peace = 1 - remaining / (placingBets || 1);
    const easeValue = this.easeMethod(peace);
    const numbersOfBot = Math.floor(easeValue * numbersOfBotInRoom);
    const numbersOfTickets = Math.floor((easeValue * remainTickets) / (numbersOfBotInRoom || 1));

    return Math.max(numbersOfBot, numbersOfTickets);
  }

  easeMethod(x) {
    const methods = ["easeInOutBounce", "easeOutBounce", "easeInBounce", "easeOutQuint"];
    const index = this.chance.integer({ min: 0, max: methods.length - 1 });
    const key = methods[index];
    const easingsFunction = easingsFunctions[key];

    return easingsFunction(x);
  }
}
