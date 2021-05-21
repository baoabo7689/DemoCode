const logger = require("./../app/web/logger").getLogger();
const appConfigs = require("./../config/appConfigs");
const chipHandler = require("./../app/Controllers/chip-management/handlers/chip-handler");
const {
  useAuthenticate,
  getSupportedGameByCurrency,
  getSupportedCurrencyGame,
  getGameMarketSetting,
} = require("./util");
const cors = require("cors");
const User = require("../app/Controllers/User");

const corsOptions = {
  origin: function (origin, callback) {
    if (appConfigs.corsUrls.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS ${origin}`));
    }
  },
};

const requestHandlers = {
  writeLogUM: (umInfo) => {
    try {
      logger.log(`UM Information: ${JSON.stringify(umInfo)}`, "error");
    } catch (ex) {
      logger.logError(ex);
    }
  },
  reload: (req, res) => {
    res.send(req.body ? req.body : "Cannot parse request object");
  },
  onlineUsers: (req, res, redT) => {
    try {
      let uusUsers = [];
      let realUsers = [];
      Object.values(redT.users).forEach(function (users) {
        users.forEach(function (cacheClient) {
          if (cacheClient && cacheClient.session) {
            const user = {
              name: cacheClient.session.memberName,
              id: cacheClient.session.memberId,
              currency: cacheClient.session.currency,
              character: cacheClient.session.characterName,
            };
            if (cacheClient.session.currency && cacheClient.session.currency.toUpperCase() === "UUS") {
              uusUsers.push(user);
            } else {
              realUsers.push(user);
            }
          }
        });
      });

      res.send({
        totalReal: realUsers.length,
        realUsers: realUsers,
        totalUUS: uusUsers.length,
        uusUsers: uusUsers,
      });
      return;
    } catch (ex) {
      logger.logError(ex);
    }

    res.send({ error: true });
  },
  getSettings: async (req, res, redT) => {
    try {
      const responseData = {
        disabledDirectLogin: appConfigs.disabledDirectLogin,
        supportedGameByCurrency: redT.umInfo && redT.umInfo.isUM ? {} : await getSupportedGameByCurrency(getSupportedCurrencyGame),
        marketConfigs: await getGameMarketSetting(),
        chips: await chipHandler.getEnabledChips(),
      };

      res.send(responseData);

      return;
    } catch (ex) {
      logger.logError(ex);
    }

    res.send({
      disabledDirectLogin: false
    });
  }, 
  refreshBalance: (req, res, redT) => {
    try {
      const { uid } = req.body;
      redT.users[uid] &&
        redT.users[uid].forEach((client) => {
          User.updateCoin(client);
        });
    } catch (ex) {
      logger.logError(ex);
    }

    res.send(req.body ? req.body : "Cannot parse request object");
  },
};

const authLogger = {
  error: logger.logError,
  warn: logger.logWarning,
};

function initRoutes(app, redT) {
  app.post("/api/reload", useAuthenticate({ logger: authLogger }), (req, res) => requestHandlers.reload(req, res));
  app.get("/api/settings", cors(corsOptions), (req, res) => requestHandlers.getSettings(req, res, redT));
  app.get("/api/onlineUsers", useAuthenticate({ logger: authLogger }), (req, res) => requestHandlers.onlineUsers(req, res, redT));
  app.post("/api/refreshBalance", useAuthenticate({ logger: authLogger }), (req, res) => requestHandlers.refreshBalance(req, res, redT));
}

module.exports = initRoutes;
