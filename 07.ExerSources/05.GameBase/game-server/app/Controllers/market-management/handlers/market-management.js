const marketRepository = require("../model/market");
const gameMarketRepository = require("../model/game-market");
const logger = require("../../../web/logger");
const appConfig = require("../../../../config/appConfigs");
const memoryCache = require("../../../common/memory-cache");
const ConfigHelper = require("./../../../Helpers/ConfigHelper");
const chipHandler = require("../../chip-management/handlers/chip-handler");
const cloneDeep = require("lodash.clonedeep");
const { getAllChips } = require("../../chip-management/model/chip");

const cacheKeys = {
  markets: "marketConfig.markets",
  gameMarket: (gameId) => `marketConfig.gameMarket.${gameId}`,
};

const defaultOptions = {
  timeout: appConfig.intervalTimeReloadConfigInSecond * 1000,
};

function getAllMarkets() {
  try {
    const getMarketFunc = () => marketRepository.getAllMarket();

    return memoryCache.getValue(cacheKeys.markets, getMarketFunc, defaultOptions);
  } catch (error) {
    logger.logError(error);
  }
}

async function getGameMarketByGameId(gameId) {
  try {
    const getGameMarketFunc = () => gameMarketRepository.getGameMarketByGameId(gameId);

    const gameConfig = await memoryCache.getValue(cacheKeys.gameMarket(gameId), getGameMarketFunc, defaultOptions);

    return gameConfig;
  } catch (error) {
    logger.logError(error);
  }
}

async function getMarketByCurrency(currency) {
  try {
    const markets = await getAllMarkets();

    return markets.find((entity) => entity.currencies.includes(currency));
  } catch (error) {
    logger.logError(error);
  }
}

async function getGameMarketByGameIdAndCurrency(gameId, currency, enabledGame) {
  try {
    const market = await getMarketByCurrency(currency);
    const marketGame = await getGameMarketByGameId(gameId);

    if (market && marketGame) {
      const marketFilter = marketGame.markets.filter((x) => x.marketId == market._id.toString());
      const marketData = Array.isArray(marketFilter) && marketFilter.length ? marketFilter[0] : null;

      if (marketData) {
        return {
          gameId: marketGame.gameId,
          gameName: marketGame.gameName,
          enabled: isEnableMarketGame(enabledGame, market.enabled, marketData.enabled),
          enabledGameMarket: market.enabled && marketData.enabled,
          marketName: market.marketName,
          minBet: marketData.minBet,
          maxBet: marketData.maxBet,
          currency: currency,
          maxBetChoices: !!marketData.maxBetChoices ? convertArrayToObject(marketData.maxBetChoices, "name", "maxBet") : null,
          rate: marketData.rate,
        };
      }
    }

    return null;
  } catch (error) {
    logger.logError(error);
  }
}

async function getSupportedGameByCurrency() {
  try {
    const markets = await getAllMarkets();
    const enabledMarkets = markets.filter((market) => market.enabled);
    const data = {};

    if (enabledMarkets) {
      for (const gameId of Object.values(appConfig.gameIds)) {
        const config = await getGameMarketByGameId(gameId);

        if (config && config.markets) {
          const marketIds = config.markets.filter((market) => market.enabled).map((market) => market.marketId);
          let currencies = [];

          if (marketIds && marketIds.length > 0) {
            currencies = enabledMarkets.reduce((result, market) => {
              if (market && market._id && marketIds.includes(market._id.toString())) {
                return result.concat(market.currencies);
              }

              return result;
            }, []);
          }

          data[gameId] = currencies;
        }
      }
    }

    return data;
  } catch (error) {
    logger.logError(error);
  }
}

async function generateMarketConfig(gameId, client, gameType) {
  try {
    const result = {};
    const configs = ConfigHelper.getConfigs(gameType);
    const marketConfig = await getGameMarketByGameIdAndCurrency(gameId, client?.session?.currency, configs.enabled);
    const language = client.language;
    const languageKeys = client.language.keys;

    if (configs && marketConfig) {
      result.minbet = marketConfig.minBet;
      result.maxbet = marketConfig.maxBet;
      result.maxBetChoices = marketConfig.maxBetChoices;
      result.enabled = marketConfig.enabled;
      result.enabledGameMarket = marketConfig.enabledGameMarket;
      result.rate = marketConfig.rate;
      result.odds = configs.odds;
    } else {
      result.enabled = false;
    }
    result.disabled_message = configs.enabled ? language.t(languageKeys.marketIsDisabled) : configs.disabled_message;

    return result;
  } catch (error) {
    logger.logError(error);
  }
}

function isEnableMarketGame(enabledGame, enabledMarket, enabledGameMarket) {
  return enabledGame && enabledMarket && enabledGameMarket;
}

async function getGameSetting() {
  try {
    const markets = await getAllMarkets();
    const gameMarketSettings = await getGameMarketSettings();

    let data = [];

    if (markets && gameMarketSettings) {
      data = markets
        .filter((market) => market.enabled)
        .reduce(async (result, market) => {
          const collection = await result;
          const settings = gameMarketSettings[market._id.toString()];
          const defaultChip = await chipHandler.getChipById(market.defaultChipId);

          if (settings) {
            collection.push({
              marketName: market.marketName,
              currencies: market.currencies,
              rate: market.rate,
              defaultChip: defaultChip.value,
              settings,
            });
          }

          return collection;
        }, []);
    }

    return data;
  } catch (error) {
    logger.logError(error);
  }
}

async function getGameMarketSettings() {
  const gameMarketConfig = {};

  for (const gameId of Object.values(appConfig.gameIds)) {
    try {
      const config = await getGameMarketByGameId(gameId);
      const chipConfigs = await chipHandler.getAllChips();

      if (config && config.markets) {
        config.markets
          .filter((market) => market.enabled)
          .forEach((marketConfig) => {
            if (marketConfig && marketConfig.enabled && marketConfig.iconSize) {
              if (!gameMarketConfig[marketConfig.marketId]) {
                gameMarketConfig[marketConfig.marketId] = [];
              }

              gameMarketConfig[marketConfig.marketId].push({
                gameId: config.gameId,
                gameName: config.gameName,
                iconSize: marketConfig.iconSize,
                sortOrder: marketConfig.sortOrder,
                chips: marketConfig.enabledChips?.reduce((result, chipId) => {
                  const chip = chipConfigs.find((chipConfig) => chipConfig._id.toString() === chipId);
                  result.push(chip.label);

                  return result;
                }, []),
              });
            }
          });
      }
    } catch (error) {
      logger.logError(error);
    }
  }

  return gameMarketConfig;
}

async function getMarketRateGroup() {
  const markets = await getAllMarkets();
  let result = [];

  if (markets && markets.length) {
    result = markets.map((market) => market.rate);
  }

  return result;
}

async function getCurrencyRate(currency) {
  const markets = await getAllMarkets();
  let result = 0;

  if (markets && markets.length) {
    const marketConfig = markets.find((market) => market.currencies?.includes(currency));
    const currencyRate = marketConfig?.rate;

    result = currencyRate || result;
  }

  return result;
}

async function getChipsCountByMarketRatio(betChoices) {
  try {
    const chips = await chipHandler.getAllChips();
    const marketRatioGroup = await getMarketRateGroup();

    const chipsCount = chips
      .filter((chip) => chip.enabled === true)
      .reduce((result, chip) => {
        result[chip.value] = 0;
        return result;
      }, {});

    const chipCountOptions = betChoices.reduce((result, betChoice) => {
      result[betChoice] = cloneDeep(chipsCount);
      return result;
    }, {});

    return marketRatioGroup.reduce((result, ratio) => {
      result[ratio] = cloneDeep(chipCountOptions);
      return result;
    }, {});
  } catch (error) {
    logger.logError(error);
  }
}

async function getBaseMarketChipsValuesDecreaseOrder(gameId) {
  try {
    const chips = await getAllChips();
    const baseMarket = await getBaseMarket();
    const gameMarkets = await getGameMarketByGameId(gameId);
    const gameMarketConfig = gameMarkets.markets.find((gameMarket) => gameMarket.marketId === baseMarket._id.toString());

    let chipValues = chips.reduce((result, chip) => {
      if (gameMarketConfig.enabledChips.includes(chip._id.toString())) {
        result.push(chip.value);
      }

      return result;
    }, []);

    if (!chipValues.length) {
      chipValues = chips.map((chip) => chip.value);
    }

    return chipValues.sort((a, b) => b - a);
  } catch (error) {
    logger.logError(error);
  }
}

async function getBaseMarket() {
  const markets = await getAllMarkets();
  const baseMarket = markets.find((market) => market.isBase);

  return baseMarket;
}

function convertArrayToObject(array, key, value) {
  try {
    return array.reduce(
      (obj, item) => ({
        ...obj,
        [item[key]]: item[value],
      }),
      {},
    );
  } catch (error) {
    logger.logError(error);
  }
}

module.exports = {
  getGameMarketByGameId,
  getMarketByCurrency,
  getGameMarketByGameIdAndCurrency,
  generateMarketConfig,
  getSupportedGameByCurrency,
  getGameSetting,
  getMarketRateGroup,
  getCurrencyRate,
  getChipsCountByMarketRatio,
  getBaseMarketChipsValuesDecreaseOrder,
  getBaseMarket,
};
