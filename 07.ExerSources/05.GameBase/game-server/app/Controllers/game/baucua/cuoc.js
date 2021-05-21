const BauCua_cuoc = require("../../../Models/BauCua/BauCua_cuoc");
const balanceApi = require("./../../../apis/balanceApi");
const gameIds = require("./../../../../config/appConfigs").gameIds;
const betChoiceMapper = require("./../../../apis/betChoiceMapper");
const logger = require("../../../web/logger");
const helper = require("./../../../Helpers/Helpers.js");
const { betChoices } = require("./../../../Cron/baucua/constants");
const marketHandler = require("../../market-management/handlers/market-management");

const BCPlayTime = 30;
const BCStopBetTime = 5;

function bauCuaCuoc(client, data, configs) {
  try {
    const languageKeys = client.language.keys;
    const language = client.language;

    if (!!data && !!data.cuoc) {
      const cuoc = data.cuoc >> 0;
      const red = true;
      const box = data.linhVat >> 0;
      const response = {
        mini: {
          baucua: {
            endCuoc: -1,
          },
        },
      };
      const baucuaData = response.mini.baucua;

      let currentCuoc = 0;
      const clientCuoc = client.redT.baucua.ingame.find((uOld) => uOld.uid == client.UID && uOld.red == red);
      const maxBetForChoice = configs.maxBetChoices[betChoices[box]];
      const currentBetOnChoice = clientCuoc && clientCuoc[box] ? clientCuoc[box] : 0;

      if (clientCuoc) {
        for (let i = 0; i < 6; i++) {
          currentCuoc += clientCuoc[i];
        }
      }

      if (client.redT.BauCua_time <= BCStopBetTime || client.redT.BauCua_time > BCPlayTime) {
        baucuaData.notice = language.t(languageKeys.betOnNextRound);
        client.red(response);
        return;
      }

      if (cuoc < configs.minbet) {
        baucuaData.notice = language.t(languageKeys.minBet, { min: helper.formatNumberWithComma(configs.minbet) });
        client.red(response);
        return;
      }

      if (cuoc > maxBetForChoice || (cuoc && currentBetOnChoice + cuoc > maxBetForChoice)) {
        baucuaData.notice = language.t(languageKeys.maxBetChoice, { max: helper.formatNumberWithComma(maxBetForChoice) });
        client.red(response);
        return;
      }

      if (cuoc > configs.maxbet || currentCuoc + cuoc > configs.maxbet) {
        baucuaData.notice = language.t(languageKeys.totalMaxBet, { max: helper.formatNumberWithComma(configs.maxbet) });
        client.red(response);
        return;
      }

      if (box < 0 || box > 5) {
        baucuaData.notice = language.t(languageKeys.betFailed);
        client.red(response);
      } else {
        const io = client.redT;
        if (clientCuoc) {
          io.baucua.ingame.forEach(function (uOld) {
            if (uOld.uid == client.UID && uOld.red == red) {
              uOld[box] += cuoc;
              uOld.cuocQueue.push({ data: data, client: client });
            }
          });
        } else {
          const addList = {
            uid: client.UID,
            name: client.profile.name,
            red: red,
            0: 0,
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            cuocQueue: [{ data: data, client: client }],
            info: io.baucua.info,
            infoAdmin: io.baucua.infoAdmin,
          };

          addList[box] = cuoc;
          io.baucua.ingame.unshift(addList);
        }
      }
    }
  } catch (ex) {
    logger.logError(ex);
  }
}

function processPlaceBet(client, data, info, infoAdmin, io, userBet) {
  const languageKeys = client.language.keys;
  const language = client.language;
  const currency = client.session.currency;

  if (!!data && !!data.cuoc) {
    const cuoc = data.cuoc >> 0;
    const red = true;
    const box = data.linhVat >> 0;
    const currentRound = client.redT.BauCua_phien;

    const placeBetSuccess = async function (user) {
      try {
        const placeBetInfo = {};
        const currencyRate = await marketHandler.getCurrencyRate(currency);
        const userBet = await BauCua_cuoc.findOne({ uid: client.UID, phien: currentRound, red: true }).exec();

        if (userBet) {
          userBet[box] += cuoc;
          userBet.save();

          betChoices.forEach((choice, choiceIndex) => {
            placeBetInfo[choice] = userBet[choiceIndex];
          });
        } else {
          const userBet = { uid: client.UID, name: client.profile.name, phien: currentRound, red: red, time: new Date() };

          if (client.session) {
            userBet.memberId = client.session.memberId;
            userBet.siteId = client.session.siteId;
          }

          await BauCua_cuoc.updateOne(
            { uid: client.UID, phien: currentRound },
            { $inc: { [box]: cuoc }, $setOnInsert: userBet },
            { upsert: true, setDefaultsOnInsert: true },
          );

          placeBetInfo[betChoices[box]] = cuoc;
        }

        info[betChoices[box]] += cuoc * currencyRate;
        infoAdmin[betChoices[box]] += cuoc * currencyRate;

        client.redT.users[client.UID].map(function (obj) {
          obj.red({
            mini: { baucua: { ownBet: placeBetInfo, endCuoc: cuoc } },
            user: { red: user.red, xu: user.xu },
          });
        });

        io.baucua.ingame.forEach(function (uOld) {
          if (uOld.uid == client.UID && uOld.red == red) {
            uOld.currentCuoc = null;
          }
        });
      } catch (error) {
        logger.logError(error);
      }
    };

    const placeBetFailed = function () {
      client.red({
        mini: {
          baucua: {
            endCuoc: -1,
          },
        },
      });

      io.baucua.ingame.forEach(function (uOld) {
        if (uOld.uid == client.UID && uOld.red == red) {
          uOld[box] -= cuoc;
          uOld.currentCuoc = null;
        }
      });
    };

    try {
      if (client == null || client.redT == null || currentRound == null) {
        userBet.currentCuoc = null;
        return;
      }

      data.inSufficientBalance = { mini: { baucua: { notice: language.t(languageKeys.notEnoughMoney) } } };
      data.gameId = gameIds.baucua;
      data.gameRoundId = currentRound;
      data.choiceId = betChoiceMapper.convertBauCua(box);

      balanceApi.placeBet({ id: client.UID }, data, client, placeBetSuccess, placeBetFailed);
    } catch (ex) {
      logger.logError(ex);
    }
  }
}

function processBetQueue(io) {
  try {
    io.baucua.ingame.forEach(function (userBet) {
      if (userBet.cuocQueue && userBet.cuocQueue.length > 0 && userBet.currentCuoc == null) {
        userBet.currentCuoc = userBet.cuocQueue.shift();

        setTimeout(() => {
          try {
            processPlaceBet(userBet.currentCuoc.client, userBet.currentCuoc.data, io.baucua.info, io.baucua.infoAdmin, io, userBet);
          } catch (error) {
            logger.logError(error);
            userBet.currentCuoc = null;
          }
        }, 0);
      }
    });
  } catch (ex) {
    logger.logError(ex);
    console.log(JSON.stringify({ message: ex.message, stack: ex.stack }));
  }
}

function initUserQueueProcessing(io) {
  const processTimeOut = 50;
  setTimeout(function processBets() {
    processBetQueue(io);

    setTimeout(processBets, processTimeOut);
  }, processTimeOut);
}

module.exports = {
  bauCuaCuoc,
  processPlaceBet,
  initUserQueueProcessing,
};
