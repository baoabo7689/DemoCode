const UserInfo = require("../../Models/UserInfo");
const logger = require("../../web/logger");
const helper = require("../../Helpers/Helpers");
const constant = require("./constants");
const marketHandler = require("../../Controllers/market-management/handlers/market-management");
const { gameIds } = require("../../../config/appConfigs");
const { betChoices } = require("./constants");

const BCStopBetTime = 5;

const generateBetAmount = (minBet, maxBet, chipList) => {
  const betAmount = helper.getRandomNumberStep5(minBet, maxBet, true);
  const betChipIndexs = helper.getRandomChips(betAmount, chipList);

  let result = minBet;

  if (betChipIndexs) {
    result = betChipIndexs.reduce((sum, value, index) => sum + chipList[index] * value, 0);
  }

  return result;
};

module.exports = async function (bot, io, maxBet, minBet, maxBetChoice) {
  try {
    const boxIndex = (Math.random() * 6) >> 0;
    const betChoice = constant.betChoices[boxIndex];

    const maxBetOnChoice = Math.min(maxBetChoice[betChoice], maxBet);
    const chipList = await marketHandler.getBaseMarketChipsValuesDecreaseOrder(gameIds.baucua);
    const totalCuoc = generateBetAmount(minBet, maxBetOnChoice, chipList);
    const user = await UserInfo.findOne({ id: bot.id }, "red").exec();

    if (user && user.red >= totalCuoc && io.BauCua_time > BCStopBetTime) {
      user.red -= totalCuoc;
      user.save();

      io.baucua.info[betChoices[boxIndex]] += totalCuoc;

      bot = null;
      io = null;
      userCuoc = null;
    }
  } catch (error) {
    console.log(error);
    logger.logError(error);
  }
};
