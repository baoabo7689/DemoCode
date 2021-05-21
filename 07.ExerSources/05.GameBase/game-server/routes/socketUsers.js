const validator = require("validator");
const User = require("../app/Models/Users");
const helpers = require("../app/Helpers/Helpers");
const socket = require("../app/socket.js");
const captcha = require("./captcha");

const userSessionManager = require("../app/web/user_session_manager");
const logger = require("../app/web/logger").getLogger();
const UserSessions = require("../app/Models/UserSessions");
const appConfigs = require("../config/appConfigs");
const language = require("../app/Helpers/language");
const { pushToDeleteQueue } = require("../app/Cron/UserCacheManagement/userCacheHandler");

// Authenticate!
const authenticate = function (client, data, callback) {
  if (!!data && !!data.username && (!!data.password || data.autoLogin)) {
    const language = client.language;
    const languageKeys = client.language.keys;

    let username = "" + data.username + "";
    let password = data.password;
    let register = !!data.register;
    let az09 = new RegExp("^[a-zA-Z0-9_]+$");
    let testName = az09.test(username);

    if (!!data.password && appConfigs.disabledDirectLogin) {
      register && client.c_captcha("signUp");
      callback(
        {
          title: register ? language.t(languageKeys.signUp) : language.t(languageKeys.signIn),
          text: language.t(languageKeys.signInIsNotSupported),
        },
        false,
      );
    } else if (!validator.isLength(username, { min: 3, max: 32 })) {
      register && client.c_captcha("signUp");
      callback(
        {
          title: register ? language.t(languageKeys.signUp) : language.t(languageKeys.signIn),
          text: language.t(languageKeys.usernameLength),
        },
        false,
      );
    } else if (!data.autoLogin && !validator.isLength(password, { min: 6, max: 32 })) {
      register && client.c_captcha("signUp");
      callback(
        {
          title: register ? language.t(languageKeys.signUp) : language.t(languageKeys.signIn),
          text: language.t(languageKeys.passwordLength),
        },
        false,
      );
    } else if (!testName) {
      register && client.c_captcha("signUp");
      callback(
        {
          title: register ? language.t(languageKeys.signUp) : language.t(languageKeys.signIn),
          text: language.t(languageKeys.usernameMustBeCharacterAndNumber),
        },
        false,
      );
    } else if (username == password) {
      register && client.c_captcha("signUp");
      callback(
        {
          title: register ? language.t(languageKeys.signUp) : language.t(languageKeys.signIn),
          text: language.t(languageKeys.usernameCanNotMatchPassword),
        },
        false,
      );
    } else {
      try {
        username = username.toLowerCase();
        // Đăng Ký
        if (register) {
          if (!data.captcha || !client.c_captcha || !validator.isLength(data.captcha, { min: 4, max: 4 })) {
            client.c_captcha("signUp");
            callback({ title: language.t(languageKeys.signUp), text: language.t(languageKeys.captchaIsNotExists) }, false);
          } else {
            let checkCaptcha = new RegExp("^" + client.captcha + "$", "i");
            checkCaptcha = checkCaptcha.test(data.captcha);
            if (checkCaptcha) {
              User.findOne({ "local.username": username }).exec(function (err, check) {
                if (!!check) {
                  client.c_captcha("signUp");
                  callback({ title: language.t(languageKeys.signUp), text: language.t(languageKeys.usernameIsExists) }, false);
                } else {
                  User.create(
                    { "local.username": username, "local.password": helpers.generateHash(password), "local.regDate": new Date() },
                    function (err, user) {
                      if (!!user) {
                        client.UID = user._id.toString();
                        callback(false, true);
                      } else {
                        client.c_captcha("signUp");
                        callback({ title: language.t(languageKeys.signUp), text: language.t(languageKeys.usernameIsExists) }, false);
                      }
                    },
                  );
                }
              });
            } else {
              client.c_captcha("signUp");
              callback({ title: language.t(languageKeys.signUp), text: language.t(languageKeys.captchaIsInvalid) }, false);
            }
          }
        } else {
          // Đăng Nhập
          User.findOne({ "local.username": username }, function (err, user) {
            if (user) {
              // Ricky: check password or sso
              if (data.autoLogin || (!appConfigs.disabledDirectLogin && user.validPassword(password))) {
                client.UID = user._id.toString();
                callback(false, true);
              } else {
                callback({ title: language.t(languageKeys.signIn), text: language.t(languageKeys.wrongPassword) }, false);
              }
            } else {
              logger.log(`Account not found at ${new Date()} Info: ${JSON.stringify(data)}`);
              callback({ title: language.t(languageKeys.signIn), text: language.t(languageKeys.usernameIsNotExists) }, false);
            }
          });
        }
      } catch (error) {
        callback({ title: language.t(languageKeys.notice), text: language.t(languageKeys.anErrorOccurred) }, false);
      }
    }
  }
};

const onRecheckin = function (session) {
  if (session && session.sessionId) {
    const sessionId = session.sessionId;
    UserSessions.findOneAndUpdate({ sessionId: sessionId }, { $set: { recheckInTime: new Date() } }).exec();
  }
};

module.exports = function (ws, redT, req) {
  try {
    ws.language = language.init();
    ws.auth = false;
    ws.UID = null;
    ws.captcha = {};
    ws.c_captcha = captcha;
    ws.red = function (data) {
      try {
        this.readyState == 1 && this.send(JSON.stringify(data));
      } catch (err) {}
    };
    ws.clientUserAgent = req.useragent ? req.useragent.source : "";
    socket.signMethod(ws);

    ws.on("message", async function (message) {
      try {
        if (!!message) {
          message = JSON.parse(message);
          if (!!message.changelanguage) {
            ws.language = language.init(message.language);
            await userSessionManager.updateLanguage(ws.session, message.language);
            return;
          }
          if (!!message.captcha) {
            this.c_captcha(message.captcha);
          }
          
          if (this.auth == false && !!message.authentication) {
            if (message.authentication && message.authentication.data && message.authentication.data.ss) {
              let verifyResult = await userSessionManager.verifyUserSession(
                message.authentication.data.ss,
                message.authentication.data.username,
                ws.clientUserAgent,
              );
              
              if (verifyResult.userSession) {
                ws.session = verifyResult.userSession;
                message.session = verifyResult.userSession;

                if (!verifyResult.isAuthenticated) {
                  this.red({ unauth: { message: "Authentication failure", isSessionExpired: true } });
                  return;
                } else {
                  message.authentication.autoLogin = true;
                  ws.language = language.init(message.authentication.data.language);
                }
              }
            } else if (message.authentication && !message.authentication.password) {
              this.red({ unauth: { message: "Authentication failure", noPassword: true } });
            }
            
            authenticate(
              this,
              message.authentication,
              async function (err, success) {
                if (success) {
                  this.auth = true;
                  this.redT = redT;
                  this.username = message.authentication.username;
                  if (!ws.session) {
                    let userSessionData = await userSessionManager.initUserSessionWithSignInFlow(message.authentication.username);
                    ws.session = userSessionData.userSession;
                    this.ss = userSessionData.userSessionIdEncrypted;
                  }

                  socket.auth(this);
                } else if (!!err) {
                  this.red({ unauth: err });
                  //this.close();
                } else {
                  this.red({ unauth: { message: "Authentication failure" } });
                  //this.close();
                }
              }.bind(this),
            );
          } else if (!!this.auth) {
            message.session = ws.session;

            if (message.reCheckin) {
              onRecheckin(ws.session);
            }

            socket.message(this, message);
          } else {
            this.red({ removeIsLoading: true });
          }
        }
      } catch (error) {
        logger.logError(error);
      }
    });

    ws.on("close", function (message) {
      try {
        if (this.UID !== null && void 0 !== this.redT.users[this.UID]) {
          pushToDeleteQueue(this.UID);
        }
        this.auth = false;
        void 0 !== this.TTClear && this.TTClear();
      } catch (ex) {
        logger.logError(ex);
      }
    });
  } catch (ex) {
    logger.logError(ex);
  }
};
