const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const modelName = "BBGame_results_config";
const projectionFields = "-_id id currency groupCurrency stakesConfig isEnable";

/**
 * @type {BBGameModel.ResultConfig}
 */
const resultConfigSchema = new Schema({
  id: Number,
  currency: String,
  groupCurrency: [],
  stakesConfig: [],
  isEnable: Boolean,
});

/**
 * @type {BBGameModel.ResultConfigRepository}
 */
const resultConfigRepository = mongoose.model("Model", resultConfigSchema, modelName);

resultConfigRepository.getAll = (currency) =>
  resultConfigRepository
    .find(Object.assign({ isEnable: true }, currency && { currency }), projectionFields)
    .lean()
    .exec();

resultConfigRepository.getStakeConfig = async function (currency, stake) {
  const entity = await resultConfigRepository.findOne({ currency, isEnable: true }, projectionFields).lean().exec();

  return entity != null ? entity.stakesConfig.find((config) => config.amount == stake) : undefined;
};

module.exports = resultConfigRepository;
