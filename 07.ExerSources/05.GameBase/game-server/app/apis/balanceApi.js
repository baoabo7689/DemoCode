const UserInfo = require("./../Models/UserInfo");
const appConfigs = require("./../../config/appConfigs");
const logger = require("./../web/logger").getLogger();

function setUserRed(userId, red) {
  UserInfo.updateOne({ id: userId }, { $set: { red: red } }).exec();
}

function isSSOAccount(session) {
  return session && !!session.siteId;
}

const balanceApi = {
  isDisabledAccountResult: (result) => {
    return result.errorCode == 2002;
  },
  updateUserBalanceToDatabase: (userId, red) => {
    try {
      if (userId && red >= 0) {
        setUserRed(userId, red);
      }
    } catch (ex) {
      logger.logError(ex);
    }
  },
  notifyUser: (result, client, extraInfo, isKickedout) => {
    if (result && client && balanceApi.isError(result)) {
      if (isKickedout) {
        client.red({
          kickedOut: { message: "Account has been closed. Please contact your upline for details, thank you.", isDisabledAccount: true },
        });
      } else {
        client.red({ apiError: { message: `${result.errorMessage} (${result.errorCode})`, ...extraInfo } });
      }
    }
  },
  isError: (result) => {
    return result.errorCode != 0;
  },
  getBalance: (user, client, cb, isUpdateUserBalance, failedcb) => {
    return UserInfo.findOne({ id: user.id })
      .exec()
      .then((userInfo) => {
        cb(userInfo);
      })
      .catch((error) => {
        logger.logError(error);
      });
  },
  placeBet: (user, betInfo, client, cb, failedcb) => {
    const betAmount = betInfo.cuoc >> 0;

    balanceApi.getBalance(
      user,
      client,
      (userInfo) => {
        // if balance is not enough
        if (!userInfo || userInfo.red < betAmount) {
          client.red(betInfo.inSufficientBalance);
          failedcb && failedcb();
        }
      },
      false,
      failedcb,
    );
  },
  endGame: (userId, gameInfo, settleInfo, clients, cb) => {
    UserInfo.updateOne({ id: userId }, { $inc: settleInfo }).exec();
    cb && cb();
  },
};

module.exports = balanceApi;
