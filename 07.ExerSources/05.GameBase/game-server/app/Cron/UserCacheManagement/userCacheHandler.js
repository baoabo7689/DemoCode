const logger = require("../../web/logger");

const delayDeleteTimeBySecond = 5;

const cache = {
  deleteQueue: [],
};

const pushToDeleteQueue = (userId, type = "users") => {
  const currentTime = new Date();

  removeFromDeleteQueue(userId);

  cache.deleteQueue.push({
    id: userId,
    expiredTime: new Date(currentTime.getTime() + delayDeleteTimeBySecond * 1000),
    type,
  });
};

const removeFromDeleteQueue = (userId, type = "users") => {
  cache.deleteQueue = cache.deleteQueue.filter((user) => user.id !== userId || user.type != type);
};

const removeUserInCache = (io, userInfo) => {
  try {
    const userType = userInfo.type;
    const userId = userInfo.id;

    if (io[userType][userId] && !io[userType][userId][0].auth) {
      if (io[userType][userId]?.length === 1) {
        delete io[userType][userId][0].redT;
      } else {
        io[userType][userId]?.forEach(function (obj, index) {
          if (obj.UID === userId) {
            delete io[userType][userId][index].redT;
          }
        });
      }

      delete io[userType][userId];
    }
  } catch (error) {
    const userId = userInfo.id;
    const userType = userInfo.type;

    error.message += ` .Detail Information: -User Id: ${userId}.`;

    if (io[userType][userId] && io[userType][userId][0]) {
      const userInfo = io[userType][userId][0];
      error.message += ` -User name: ${userInfo.username}.`;
    }

    logger.logError(error);
  }
};

const removeExpiredUser = (io) => {
  const currentTime = new Date();

  cache.deleteQueue = cache.deleteQueue.reduce((result, user) => {
    if (currentTime > user.expiredTime) {
      removeUserInCache(io, user);
    } else {
      result.push(user);
    }

    return result;
  }, []);
};

const run = (io) => {
  let gameLoop = setInterval(() => {
    try {
      removeExpiredUser(io);
    } catch (error) {
      logger.logError(error);
    }
  }, delayDeleteTimeBySecond * 1000);

  return gameLoop;
};

module.exports = {
  run,
  pushToDeleteQueue,
  removeFromDeleteQueue,
};
