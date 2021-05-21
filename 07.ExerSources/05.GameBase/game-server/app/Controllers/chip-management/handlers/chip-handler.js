const chipRepository = require("../model/chip");
const appConfig = require("../../../../config/appConfigs");
const logger = require("../../../web/logger");
const memoryCache = require("../../../common/memory-cache");

const cacheKey = "chipConfig.chips";

const defaultOptions = {
  timeout: appConfig.intervalTimeReloadConfigInSecond * 1000,
};

async function getEnabledChips() {
  try {
    const chips = await getAllChips();
    const data = chips
      .filter((chip) => chip.enabled === true)
      .reduce((result, chip) => {
        result.push({
          label: chip.label,
          value: chip.value,
          enabled: chip.enabled,
          theme: chip.theme,
        });

        return result;
      }, []);

    return data;
  } catch (error) {
    logger.logError(error);
  }
}

async function getEnabledChipValues() {
  try {
    const chips = await getAllChips();

    const data = chips
      .filter((chip) => chip.enabled === true)
      .map((chip) => chip.value)
      .reverse();

    return data;
  } catch (error) {
    logger.logError(error);
  }
}

async function getAllChips() {
  const getAllChipsFunc = () => chipRepository.getAllChips();
  const chips = await memoryCache.getValue(cacheKey, getAllChipsFunc, defaultOptions);

  return chips;
}

async function getChipById(chipId) {
  try {
    const chips = await getAllChips();
    const result = chips.find((chip) => chip._id.toString() === chipId);

    return result;
  } catch (error) {
    logger.logError(error);
  }
}

module.exports = {
  getEnabledChips: getEnabledChips,
  getEnabledChipValues: getEnabledChipValues,
  getChipById: getChipById,
  getAllChips: getAllChips,
};
