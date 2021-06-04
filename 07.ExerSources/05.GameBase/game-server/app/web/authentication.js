const User = require("../Models/Users");
const helpers = require("../Helpers/Helpers");

const userSessionManager = require("./user_session_manager");
const appConfigs = require("../../config/appConfigs");
const authApi = require("./../apis/authApi");
const logger = require("./logger").getLogger();

const cors = require("cors");
const corsOptions = {
  origin: function (origin, callback) {
    //callback(null, true);
    if (appConfigs.corsUrls.indexOf(origin) !== -1 || !origin || appConfigs.env === "LOCAL") {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS ${origin}`));
    }
  },
};

function runAsyncWrapper(callback) {
  return function (req, res, next) {
    callback(req, res, next).catch(next);
  };
}

async function handleAuthenticatedRequest(data, verifyParams, res) {
  data.memberKey = `${data.clientId}_${data.memberId}`.toLowerCase();
  let user = await User.findOne({ "local.username": data.memberKey });

  if (!user) {
    user = await User.create({
      "local.username": data.memberKey,
      "local.password": helpers.generateHash(data.memberKey + "!@#QWE"),
      "local.regDate": new Date(),
      "local.memberId": data.memberId,
      "local.memberName": data.memberName,
      "local.clientId": data.clientId,
      "local.currency": data.currency,
    });
  }

  data.userId = user.id;
  const userSession = await userSessionManager.initUserSession(data, verifyParams);

  res.send({
    isAuthenticated: true,
    username: user.local.username,
    language: data.language,
    ss: userSession.userSessionIdEncrypted,
    currency: data.currency,
  });
}

function initAuthentication(app) {
  app.get(
    "/authenticate",
    cors(corsOptions),
    runAsyncWrapper(async (req, res) => {
      try {
        let userIp = req.ipInfo.ip;

        if (userIp && userIp.includes(",")) {
          userIp = userIp.split(",")[0].trim();
        }

        const verifyParams = {
          browserUserAgent: req.useragent.source,
          ip: userIp,
          token: req.query.token,
          username: req.query.username,
          userId: req.query.userId
        };
        if (verifyParams.ip.substr(0, 7) == "::ffff:") {
          verifyParams.ip = verifyParams.ip.substr(7);
        }
        const data = await authApi.verifyToken(verifyParams);

        if (data && data.isSuccessful) {
          await handleAuthenticatedRequest(data, verifyParams, res);
          if (data.currency && data.currency.toUpperCase() === "UUS") {
            data.currency = "UUS";
          }
        } else {
          logger.log(
            [
              `Authentication Failed`,
              `Request: ${JSON.stringify(verifyParams)}`,
              `Result: ${JSON.stringify(data)}`,
              `IP Info: ${userIp}`,
            ].join("\n"),
          );
          res.send({ isAuthenticated: false });
        }
      } catch (error) {
        logger.logError(error);

        res.send({ isAuthenticated: false, error: "Lỗi Đăng Nhập" });
      }
    }),
  );
}

module.exports = initAuthentication;
