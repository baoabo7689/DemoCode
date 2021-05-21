const mongoose = require("mongoose");
const modelName = "game_markets";
/**
 * @type {MarketManagementModel.GameMarketModel}
 */

let Schema = new mongoose.Schema({
  gameId: Number,
  gameName: String,
  markets: [],
  botEnabled: {
    type: Boolean,
    default: true,
  },
  botMaxBet: {
    type: Number,
    default: 0,
  },
});

/**
 * @type {MarketManagementModel.GameMarketRepository}
 */
const gameMarketRepository = mongoose.model("game_market", Schema);

gameMarketRepository.getGameMarketByGameId = function (gameId) {
  return gameMarketRepository
    .findOne(
      {
        gameId: gameId,
      },
      null,
      {
        sort: {
          id: -1,
        },
      },
    )
    .lean()
    .exec();
};

gameMarketRepository.getAllGameMarket = () => gameMarketRepository.find().lean().exec();

module.exports = gameMarketRepository;
