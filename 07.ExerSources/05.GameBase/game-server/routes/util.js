const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");
const config = require("../config/appConfigs.js");
const resultConfigRepository = require("../app/Models/result-config");
const marketHandler = require("../app/Controllers/market-management/handlers/market-management");

const lowercaseFirstCharacter = (req, _, next) => {
  const newBody = Object.keys(req.body).reduce((result, key) => {
    const newKey = key[0].toLowerCase() + key.substr(1);
    result[newKey] = req.body[key];

    return result;
  }, {});

  const newQuery = Object.keys(req.query).reduce((result, key) => {
    const newKey = key[0].toLowerCase() + key.substr(1);
    result[newKey] = req.query[key];

    return result;
  }, {});

  req.body = newBody;
  req.query = newQuery;
  next();
};

const toFixed = (value, number) => {
  const d = Math.pow(10, number);
  return Math.round(value * d) / d;
};

const errors = {
  SB1000: {
    errorCode: "SB1000",
    errorDescription: "An Error has occurred.",
  },
  SB1001: {
    errorCode: "SB1001",
    errorDescription: "The game round does not exist.",
  },
  SB1002: {
    errorCode: "SB1002",
    errorDescription: "Game round id is required.",
  },
  SB1003: {
    errorCode: "SB1003",
    errorDescription: "Site Id is required.",
  },
  SB1004: {
    errorCode: "SB1004",
    errorDescription: "ObCustId is required.",
  },
  SB1005: {
    errorCode: "SB1005",
    errorDescription: "Game round is running.",
  },
  SB1006: {
    errorCode: "SB1006",
    errorDescription: "GameTypeId is invalid.",
  },
};

const useAuthenticate = (options) => {
  const authUrl = options.authUrl || config.apiSettings.authUrl;
  const jwks = ".well-known/openid-configuration/jwks";
  const jwksUri = new URL(jwks, authUrl).href;
  const client = jwksClient({ jwksUri });
  const audiences = options.audiences || config.authenticateSettings.audiences;
  const logger = options.logger || { error: () => ({}), warn: () => ({}) };

  const getTokenFromHeaders = (req) => {
    const tokenType = "Bearer";
    const {
      headers: { authorization },
    } = req;

    if (authorization && authorization.split(" ")[0] === tokenType) {
      return authorization.split(" ")[1];
    }
    return null;
  };

  const getSinginKey = (client, logger) => (header, callback) => {
    client.getSigningKey(header.kid, (error, key) => {
      if (error) {
        logger.error(error);
        callback(error);
      } else {
        callback(null, key.publicKey || key.rsaPublicKey);
      }
    });
  };

  return (req, res, next) => {
    const token = getTokenFromHeaders(req);

    jwt.verify(token, getSinginKey(client, logger), { ignoreNotBefore: true }, (error, result) => {
      if (error) {
        logger.warn({
          url: req.url,
          error: error,
        });
        res.sendStatus(401);
      } else {
        if (audiences.includes(result.aud)) {
          next();
        } else {
          logger.warn({ token: result, audiences });
          res.sendStatus(401);
        }
      }
    });
    //next();
  };
};

/**
 * @param  {...() => Promise<Record<Number, String[]>} dataHandler
 * @returns {Promise<Record<Number, String[]>>}
 */
const getSupportedGameByCurrency = async (...dataHandler) => {
  if (dataHandler && dataHandler.length) {
    /**
     * @param {Record<Number | String, String[]>} result
     * @param {Record<Number | String, String[]>} record
     */
    const flatData = (result, record) => {
      Object.entries(record).forEach(([gameTypeId, supportedCurrencies]) => {
        const currencies = (result[gameTypeId] || []).concat(supportedCurrencies || []);
        result[gameTypeId] = Array.from(new Set(currencies));
      });

      return result;
    };

    const dataFromMultipleResource = await Promise.all(dataHandler.map((handle) => handle()));

    return dataFromMultipleResource.reduce(flatData, {});
  }

  return {};
};

const getSupportedCurrencyBolaTangkasGame = async () => {
  const configs = await resultConfigRepository.getAll();
  const currencies = configs.flatMap((config) => (config.isEnable ? config.groupCurrency : []));

  return currencies;
};

const getSupportedCurrencyGame = async () => {
  const bolaGameId = config.gameIds.bolaTangkas;
  const supportedCurrencies = await marketHandler.getSupportedGameByCurrency();
  const supportedCurrenciesBola = await getSupportedCurrencyBolaTangkasGame();

  if (supportedCurrencies[bolaGameId] && supportedCurrenciesBola) {
    supportedCurrencies[bolaGameId] = supportedCurrencies[bolaGameId].filter((element) => supportedCurrenciesBola.includes(element));
  }

  return supportedCurrencies;
};

const getGameMarketSetting = async () => {
  return marketHandler.getGameSetting();
};

module.exports = {
  lowercaseFirstCharacter,
  errors,
  toFixed,
  useAuthenticate,
  getSupportedGameByCurrency,
  getSupportedCurrencyGame,
  getGameMarketSetting,
};
