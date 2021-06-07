const balanceApi = require("./../apis/balanceApi");
const Helper = require("../Helpers/Helpers");
const Phone = require("../Models/Phone");
const UserInfo = require("../Models/UserInfo");
const { removeFromDeleteQueue } = require("../Cron/UserCacheManagement/userCacheHandler");

const sessionManager = require("./../web/user_session_manager");
const Message = require("../Models/Message");
const authApi = require("./../apis/authApi");

let first = function (client) {
  UserInfo.findOne(
    { id: client.UID },
    "name lastVip redPlay red xu ketSat UID cmt email security joinedOn avatarId currency isCash",
    function (err, user) {
      if (!!user) {
        user = user._doc;
        let vipHT = ((user.redPlay - user.lastVip) / 100000) >> 0; // Điểm vip Hiện Tại
        // Cấp vip hiện tại
        let vipLevel = 1;
        let vipPre = 0; // Điểm víp cấp Hiện tại
        let vipNext = 100; // Điểm víp cấp tiếp theo
        if (vipHT >= 120000) {
          vipLevel = 9;
          vipPre = 120000;
          vipNext = 0;
        } else if (vipHT >= 50000) {
          vipLevel = 8;
          vipPre = 50000;
          vipNext = 120000;
        } else if (vipHT >= 15000) {
          vipLevel = 7;
          vipPre = 15000;
          vipNext = 50000;
        } else if (vipHT >= 6000) {
          vipLevel = 6;
          vipPre = 6000;
          vipNext = 15000;
        } else if (vipHT >= 3000) {
          vipLevel = 5;
          vipPre = 3000;
          vipNext = 6000;
        } else if (vipHT >= 1000) {
          vipLevel = 4;
          vipPre = 1000;
          vipNext = 3000;
        } else if (vipHT >= 500) {
          vipLevel = 3;
          vipPre = 500;
          vipNext = 1000;
        } else if (vipHT >= 100) {
          vipLevel = 2;
          vipPre = 100;
          vipNext = 500;
        }
        user.level = vipLevel;
        user.vipNext = vipNext - vipPre;
        user.vipHT = vipHT - vipPre;

        delete user._id;
        delete user.redPlay;
        delete user.lastVip;

        if (!Helper.isEmpty(user.email)) {
          user.email = Helper.cutEmail(user.email);
        }

        client.profile = { name: user.name };
        user.ss = {
          isAuthenticated: true,
          username: client.username,
          language: client.session ? client.session.language : "",
          ss: client.session ? sessionManager.generatedEncryptedSessionId(client.session.sessionId) : "",
          isSSO: !!client.session.ssoToken,
          time: new Date(),
          currency: client.session ? client.session.currency : "",
        };

        addToListOnline(client);

        Phone.findOne({ uid: client.UID }, {}, function (err2, dataP) {
          user.phone = dataP ? Helper.cutPhone(dataP.region + dataP.phone) : "";
          let data = {
            Authorized: true,
            user: user,
          };
          Message.countDocuments({ uid: client.UID, read: false }).exec(function (errMess, countMess) {
            data.message = { news: countMess };

            if (!!user.currency) {
              client.session.characterName = user.name;
              authApi.notifyLogin(client, client.session, { characterName: user.name, firstLogin: false });

              balanceApi.getBalance(
                { id: client.UID },
                client,
                (userInfo) => {
                  data.user.red = userInfo.red;
                  client.red(data);
                },
                true,
              );
            } else {
              client.red(data);
            }
          });
        });
      } else {
        client.red({ Authorized: false });
      }
    },
  );
};

function addToListOnline(client) {
  try {
    if (void 0 !== client.redT.users[client.UID]) {
      client.redT.users[client.UID].forEach((cacheClient) => {
        const language = cacheClient.language;
        const languageKeys = cacheClient.language.keys;
        cacheClient.red({ kickedOut: { message: language.t(languageKeys.duplicatedLoginMessage) } });
        cacheClient.close();
      });
    }

    client.redT.users[client.UID] = [client];
    removeFromDeleteQueue(client.UID);
  } catch (ex) {
    logger.logError(ex);
  }
}

let updateCoin = function (client) {
  balanceApi.getBalance({ id: client.UID }, client, (user) => {
    if (!!user) {
      client.red({ user: { red: user.red, currency: user.currency } });
    }
  });
};

module.exports = {
  first: first,
  updateCoin: updateCoin
};
