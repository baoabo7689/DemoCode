const mongoose = require("mongoose");
const modelName = "markets";

/**
 * @type {MarketManagementModel.MarketModel}
 */
let Schema = new mongoose.Schema({
  currencies: [],
  marketName: {
    type: String,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  rate: Number,
  defaultChipId: String,
  isBase: Boolean,
});

/**
 * @type {MarketManagementModel.MarketRepository}
 */
const marketRepository = mongoose.model(modelName, Schema);

marketRepository.getMarketByName = function (marketName) {
  return marketRepository
    .findOne(
      {
        marketName: marketName,
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

marketRepository.getMarketByCurrency = function (currency) {
  return marketRepository
    .findOne(
      {
        currencies: currency,
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

marketRepository.getAllMarket = () => marketRepository.find().lean().exec();

module.exports = marketRepository;
