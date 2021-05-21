const fs = require("fs");

const Helpers = require("../Helpers/Helpers");
const UserInfo = require("../Models/UserInfo");
const BauCua_phien = require("../Models/BauCua/BauCua_phien");
const BauCua_cuoc = require("../Models/BauCua/BauCua_cuoc");
const BauCua_temp = require("../Models/BauCua/BauCua_temp");
const GameConfigs = require("../Models/GameConfigs");

const balanceApi = require("./../apis/balanceApi");
const ConfigHelper = require("../Helpers/ConfigHelper");
const appConfigs = require("./../../config/appConfigs");
const diceRandom = require("./../Controllers/diceRandom");
const bauCuaConfigs = require("../Controllers/game/baucua/configs");
const bot = require("./baucua/bot");
const logger = require("./../web/logger");
const { betChoices } = require("./baucua/constants");
const constants = require("./baucua/constants");

let botList = [];
let io = null;
let gameLoop = null;

const BCPlayTime = 30;
const BCTimeToNext = 10;
const BCStopBetTime = 5;
const TotalBCTime = BCPlayTime + BCTimeToNext + 1;
let configs = null;

const init = function init(obj) {
  io = obj;
  io.BauCua_phien = 1;
  io.baucua = {
    ingame: [],
  };
  io.baucua.info = Helpers.generateBetChoiceSummary(betChoices);

  io.baucua.infoAdmin = Helpers.generateBetChoiceSummary(betChoices);

  BauCua_phien.findOne(
    {},
    "id",
    {
      sort: {
        _id: -1,
      },
    },
    function (err, last) {
      if (!!last) {
        io.BauCua_phien = last.id + 1;
      }
      playGame();
    },
  );
};

const thongtin_thanhtoan = function thongtin_thanhtoan(dice = null, settlementTime) {
  try {
    if (!!dice) {
      let heSo = {}; // Hệ số nhân
      for (let i = 0; i < 3; i++) {
        let dataT = dice[i];
        if (void 0 === heSo[dataT]) {
          heSo[dataT] = 1;
        } else {
          heSo[dataT] += 1;
        }
      }
      // apply oddsodds
      Object.keys(heSo).forEach((key) => (heSo[key] = bauCuaConfigs.odds[heSo[key] - 1] - 1));

      let updateLog = {};
      for (let j = 0; j < 6; j++) {
        if (void 0 !== heSo[j]) {
          updateLog[j] = heSo[j];
        }
      }
      let phien = io.BauCua_phien - 1;

      BauCua_temp.updateOne({}, { $inc: updateLog }).exec();

      BauCua_cuoc.find({ round: phien }, {}, function (err, list) {
        if (err) {
          logger.logError(err);
        }
        try {
          if (list.length) {
            Promise.all(
              list.map(function (cuoc) {
                let TienThang = 0; // Số tiền thắng (chưa tính gốc)
                let TongThua = 0; // Số tiền thua
                let TongThang = 0; // Tổng tiền thắng (đã tính gốc)

                for (let i = 0; i < 6; i++) {
                  if (cuoc[i] > 0) {
                    if (heSo[i]) {
                      const winAmount = cuoc[i] * heSo[i];

                      TienThang += winAmount;
                      TongThang += cuoc[i] + winAmount;
                    } else {
                      TongThua += cuoc[i];
                    }
                  }
                }

                let tongDat = cuoc[0] + cuoc[1] + cuoc[2] + cuoc[3] + cuoc[4] + cuoc[5];

                cuoc.payment = true;
                cuoc.betwin = TongThang;
                cuoc.save();

                return new Promise((resolve) => {
                  updateUserRed(
                    cuoc,
                    { TongThang, tongDat, TienThang, TongThua },
                    phien,
                    () => {
                      if (io.users[cuoc.uid]) {
                        let status = {};
                        if (TongThang > 0) {
                          status = {
                            mini: {
                              baucua: {
                                status: {
                                  win: true,
                                  bet: TongThang,
                                },
                              },
                            },
                          };
                        } else {
                          status = {
                            mini: {
                              baucua: {
                                status: {
                                  win: false,
                                  bet: TongThua,
                                },
                              },
                            },
                          };
                        }
                        io.users[cuoc.uid].forEach(function (client) {
                          client.red(status);
                        });
                        status = null;
                      }

                      resolve({
                        users: cuoc.name,
                        bet: TienThang,
                        red: cuoc.red,
                        tienThua: TongThua,
                        tienDat: tongDat,
                      });
                    },
                    settlementTime,
                  );
                });
              }),
            )
              .then(function (results) {
                heSo = null;
                phien = null;
                dice = null;
                playGame();
              })
              .catch((error) => logger.logError(error));
          } else {
            heSo = null;
            phien = null;
            dice = null;
            playGame();
          }
        } catch (ex) {
          logger.logError(ex);
        }
      });
    } else {
      Object.values(io.users).forEach(function (users) {
        users.forEach(function (client) {
          if (client.gameEvent !== void 0 && client.gameEvent.viewBauCua !== void 0 && client.gameEvent.viewBauCua) {
            client.red({
              mini: {
                baucua: {
                  data: io.baucua.info,
                },
              },
            });
          }
        });
      });

      let admin_data = {
        baucua: {
          info: io.baucua.infoAdmin,
          ingame: io.baucua.ingame,
        },
      };
      Object.values(io.admins).forEach(function (admin) {
        admin.forEach(function (client) {
          if (client.gameEvent !== void 0 && client.gameEvent.viewBauCua !== void 0 && client.gameEvent.viewBauCua) {
            client.red(admin_data);
          }
        });
      });
    }
  } catch (ex) {
    logger.logError(ex);
  }
};

const updateUserRed = function (cuoc, sum, phien, cb, settlementTime) {
  try {
    if (cuoc.red) {
      const update = {};
      const updateGame = {};

      if (sum.TongThang > 0) {
        update["red"] = sum.TongThang;
      }
      if (sum.TienThang > 0) {
        update["redWin"] = updateGame["red"] = sum.TienThang;
      }
      if (sum.TongThua > 0) {
        update["redLost"] = updateGame["red_lost"] = sum.TongThua;
      }

      update["redPlay"] = updateGame["redPlay"] = sum.tongDat;

      const gameInfo = {
        gameId: appConfigs.gameIds.baucua,
        gameRoundId: phien,
        memberId: cuoc.memberId,
        siteId: cuoc.siteId,
        time: settlementTime,
      };

      balanceApi.endGame(cuoc.uid, gameInfo, update, io.users, () => {
        cb && cb();
      });
    }
  } catch (ex) {
    logger.logError(ex);
    cb && cb();
  }
};

const checkGameStatus = async function (io) {
  try {
    const baucuaConfig = await GameConfigs.findOne({ name: ConfigHelper.GameTypes.BauCua }).lean().exec();

    configs = baucuaConfig;
    ConfigHelper.updateConfig(ConfigHelper.GameTypes.BauCua, baucuaConfig);

    if (!configs || !configs.enabled) {
      const disabledMessage = configs ? configs.disabled_message : "";

      io.sendAllUser({
        mini: {
          baucua: {
            um: true,
            um_message: disabledMessage,
          },
        },
      });

      GameConfigs.updateOne({ name: ConfigHelper.GameTypes.BauCua }, { disabledround: io.BauCua_phien });

      io.BauCua_time = TotalBCTime;
    } else {
      io.sendAllUser({
        mini: { baucua: { time_remain: io.BauCua_time } },
      });
    }
  } catch (error) {
    logger.logError(error);
  }
};

const clearPreviousRoundData = async function (io) {
  io.baucua.ingame = [];
  io.baucua.info = Helpers.generateBetChoiceSummary(constants.betChoices);
  io.baucua.infoAdmin = Helpers.generateBetChoiceSummary(constants.betChoices);
};

const settle = async function (io) {
  {
    clearInterval(gameLoop);

    io.BauCua_time = 0;

    let dice1 = 6;
    let dice2 = 6;
    let dice3 = 6;

    fs.readFile("./data/baucua.json", "utf8", async (errjs, bcjs) => {
      try {
        if (errjs) {
          logger.logError(errjs);
        }

        const resultBC = diceRandom.randomBC();

        if (appConfigs.env == "PRO") {
          dice1 = resultBC[0];
          dice2 = resultBC[1];
          dice3 = resultBC[2];
        } else {
          let baucuaData = JSON.parse(bcjs);

          dice1 = baucuaData[0] == 6 ? resultBC[0] : baucuaData[0];
          dice2 = baucuaData[1] == 6 ? resultBC[1] : baucuaData[1];
          dice3 = baucuaData[2] == 6 ? resultBC[2] : baucuaData[2];

          baucuaData[0] = 6;
          baucuaData[1] = 6;
          baucuaData[2] = 6;
          baucuaData.uid = "";
          baucuaData.rights = 2;

          fs.writeFile("./data/baucua.json", JSON.stringify(baucuaData), function (err) {
            if (err) logger.logError(err);
          });
        }

        const newRound = await BauCua_phien.create({
          dice1: dice1,
          dice2: dice2,
          dice3: dice3,
          time: new Date(),
        });

        if (newRound) {
          io.BauCua_phien = newRound.id + 1;
          thongtin_thanhtoan([dice1, dice2, dice3], newRound.time);
        }

        io.sendAllUser({
          mini: {
            baucua: {
              data: io.baucua.info,
              finish: {
                dices: [newRound.dice1, newRound.dice2, newRound.dice3],
                round: newRound.id,
              },
            },
          },
        });

        Object.values(io.admins).forEach(function (admin) {
          admin.forEach(function (client) {
            client.red({
              baucua: {
                data: io.baucua.info,
                finish: {
                  dices: [newRound.dice1, newRound.dice2, newRound.dice3],
                  round: newRound.id,
                },
              },
            });
          });
        });

        configs = ConfigHelper.getConfigs(ConfigHelper.GameTypes.BauCua);
      } catch (err) {
        if (err) logger.logError(err);
      }
    });
  }
};

const resetBot = (configs) => {
  try {
    if (configs.botenabled) {
      UserInfo.find(
        {
          type: true,
        },
        "id name",
        function (err, blist) {
          if (err) {
            logger.logError(err);
          }

          if (blist.length) {
            Promise.all(
              blist.map(function (buser) {
                buser = buser._doc;
                delete buser._id;

                return buser;
              }),
            )
              .then((result) => {
                totalBots = result;

                let maxBot = Math.floor(result.length * ConfigHelper.getMaxBotForCurrentHour(ConfigHelper.GameTypes.BauCua));

                botList = Helpers.shuffle(result);
                botList = botList.slice(0, maxBot);
              })
              .catch((promiseErr) => logger.logError(promiseErr));
          }
        },
      );
    } else {
      botList = [];
    }
  } catch (error) {
    logger.logError(error);
    botList = [];
  }
};

const processGame = (configs) => {
  {
    thongtin_thanhtoan();

    let maxBet = 10;
    let minBet = 1;
    if (!!configs) {
      if (!!configs.bot_maxbet && configs.bot_maxbet > 0) {
        maxBet = configs.bot_maxbet;
      }
      if (configs.minbet > 0) {
        minBet = configs.minbet;
      }
    }

    if (!!botList.length && io.BauCua_time > BCStopBetTime) {
      const maxBotRandom = botList.length / io.BauCua_time;
      const userCuoc = Math.floor(Math.random() * maxBotRandom + 1);

      for (let i = 0; i < userCuoc; i++) {
        let dataT = botList[i];
        if (!!dataT) {
          bot(dataT, io, maxBet, minBet, configs.choices_maxbet);
          botList.splice(i, 1);
        }
        dataT = null;
      }
    }
  }
};

const playGame = function () {
  io.BauCua_time = TotalBCTime;
  this.disabled = false;
  configs = ConfigHelper.getConfigs(ConfigHelper.GameTypes.BauCua);

  gameLoop = setInterval(async function () {
    try {
      if (io.BauCua_time == TotalBCTime) {
        checkGameStatus(io);
      }

      if (configs && configs.enabled) {
        io.BauCua_time--;
      }

      if (io.BauCua_time === BCPlayTime) {
        clearPreviousRoundData(io);
      }

      if (io.BauCua_time >= 0 && io.BauCua_time < BCPlayTime) {
        processGame(configs);
      }

      if (io.BauCua_time < 0) {
        settle(io);

        resetBot(configs);
      }
    } catch (ex) {
      logger.logError(ex);
    }
  }, 1000);
  return gameLoop;
};

module.exports = init;
