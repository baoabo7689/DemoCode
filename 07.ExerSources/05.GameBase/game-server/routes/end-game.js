const BAUCUA = require("../app/Models/BauCua/BauCua_cuoc");
const BAUCUA_PHIEN = require("../app/Models/BauCua/BauCua_phien");
const Config = require("../config/appConfigs");
const logger = require("../app/web/logger");
const { lowercaseFirstCharacter, errors, toFixed, useAuthenticate } = require("./util");

const transformRequestToQuery = (params, otherParams) => ({
  round: parseInt(params.gameRoundId),
  siteId: params.siteId,
  memberId: parseInt(params.obCustId),
  payment: true,
  ...otherParams,
});

const sendError = (error, res) => {
  res.send(error);
};

const getEndTime = (model) => async (params) => {
  const id = parseInt(params.gameRoundId);
  const round = await model.findOne({ id }).exec();
  logger.log(JSON.stringify(params));

  if (!!round) {
    return { endTime: round.time || 0 };
  } else {
    throw errors.SB1001;
  }
};

const calculateData = async (model, query, reducer) => {
  const data = await model.find(query).exec();

  if (data && data.length > 0) {
    return sumData(data, reducer);
  } else {
    throw errors.SB1001;
  }
};

function sumData(data, reducer) {
  const defaultResponse = {
    validBetAmount: 0,
    totalAmount: 0,
    totalWin: 0,
  };

  return data.reduce(reducer, defaultResponse);
}

const metadata = {
  [Config.gameIds.baucua]: {
    handler: [
      async (params) => {
        const query = transformRequestToQuery(params);
        const reducer = (result, cuoc) => {
          result.validBetAmount += [...Array(6).keys()].reduce((result, key) => result + cuoc[key], 0);

          result.totalAmount = result.validBetAmount;
          result.totalWin += cuoc.betWin;

          return result;
        };

        return await calculateData(BAUCUA, query, reducer);
      },
      getEndTime(BAUCUA_PHIEN),
    ],
  }
};

const handleRequest = (params, res) => {
  const gameType = params.gameTypeId;
  const data = metadata[gameType];

  Promise.all(data.handler.map((func) => func(params)))
    .then((values) => values.reduce((result, data) => Object.assign(result, data), {}))
    .then((data) => {
      data.validBetAmount = toFixed(data.validBetAmount, 2);
      data.totalAmount = toFixed(data.totalAmount, 2);
      data.totalWin = toFixed(data.totalWin, 2);

      return data;
    })
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      sendError(error.errorCode ? error:errors.SB1000, res);      
    });
};

const gameTypeIds = Object.values(Config.gameIds);

const validateParams = (req, res, next) => {
  const params = req.body;
  if (!params.gameRoundId) {
    sendError(errors.SB1002, res);
  } else if (!params.siteId) {
    sendError(errors.SB1003, res);
  } else if (!params.obCustId) {
    sendError(errors.SB1004, res);
  } else if (!gameTypeIds.includes(params.gameTypeId >> 0)) {
    sendError(errors.SB1006, res);
  } else {
    next();
  }
};

module.exports = function (app) {
  app.post(
    "/api/endgameinfo",
    useAuthenticate({
      logger: {
        error: logger.logError,
        warn: logger.logWarning,
      }
    }),
    lowercaseFirstCharacter,
    validateParams,
    (req, res) => handleRequest(req.body, res),
  );
};
