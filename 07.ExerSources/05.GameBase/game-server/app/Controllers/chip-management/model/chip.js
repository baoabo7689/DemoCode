const mongoose = require("mongoose");
const modelName = "chips";

/**
 * @type {ChipManagementModel.ChipModel}
 */
let Schema = new mongoose.Schema({
  label: {
    type: String,
  },
  value: {
    type: Number,
  },
  enabled: {
    type: Boolean,
    default: false,
  },
  theme: {},
});

/**
 * @type {ChipManagementModel.ChipRepository}
 */
const chipRepository = mongoose.model(modelName, Schema);

chipRepository.getAllChips = () => chipRepository.find().sort({ value: 1 }).lean().exec();

module.exports = chipRepository;
