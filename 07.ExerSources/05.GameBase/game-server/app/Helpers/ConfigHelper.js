const GameConfigs = require("../Models/GameConfigs");
const gameIds = require("../../config/appConfigs").gameIds;
const logger = require("../web/logger");

const GameTypes = {
  BauCua: "baucua"
};

const GameIdMapper = {
  [gameIds.baucua]: GameTypes.BauCua
};

const configsDict = [];

const loadConfigs = function (configName) {
  GameConfigs.findOne({ name: configName })
    .exec()
    .then(function (data) {
      try {
        updateConfig(configName, data);
      } catch (err) {
        logger.logError(err);
      }
    })
    .catch(function (error) {
      logger.logError(error);
    });
};

const loadAllConfigs = function () {
  Promise.all([
    loadConfigs(GameTypes.BauCua)
  ]).catch(function (err) {
    if (err) console.log(err);
  });
};

const reloadConfigs = function (configName) {
  GameConfigs.findOne({ name: configName })
    .then(function (data) {
      updateConfig(configName, data);
    })
    .catch(function (error) {
      logger.logError(error);
    });
};

const getConfigs = function (configName) {
  if (!!configsDict && !!configsDict[configName]) {
    return configsDict[configName];
  }

  return null;
};

const updateConfig = function (configName, data) {
  if (!!configsDict) {
    configsDict[configName] = data;
  }
};

const getMaxBotForCurrentHour = function (configName) {
  const configs = getConfigs(configName);

  if (!!configs) {
    const currentHour = new Date().getUTCHours();

    if (!!configs.hour_maxbot && configs.hour_maxbot.length > 0) {
      return configs.hour_maxbot[currentHour];
    }

    return configs.maxbot;
  }

  return 0;
};

const getGameConfigKey = function (gameId) {
  return GameIdMapper[gameId];
};

module.exports = {
  loadConfigs: loadConfigs,
  reloadConfigs: reloadConfigs,
  getConfigs: getConfigs,
  updateConfig: updateConfig,
  loadAllConfigs: loadAllConfigs,
  getMaxBotForCurrentHour: getMaxBotForCurrentHour,
  GameTypes: GameTypes,
  getGameConfigKey: getGameConfigKey,
};
