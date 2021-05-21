const consoleLogger = {
  isEnabled: true,
  start: () => {
    console.log(`Logger started at ${new Date()}.`);
  },

  log: (message, level = "info") => {
    console.log(`Info: ${message}.`);
  },

  logWarning: (message) => {
    console.log(`Warning: ${message}.`);
  },

  logCritical: (message) => {
    console.log(`Critical: ${message}.`);
  },

  logError: (exception) => {
    console.log(`Error: ${message}.`);
  },

  logAfterSendToApi: (action, params, result, beforeMessage, logLevel) => {
      const messages = [
        `Account ${params.SiteId}_${params.ObCustId} performs ${action} at ${new Date()}`,
        "",
        beforeMessage,
        `\nAction Result: ${JSON.stringify(result)}`,
      ];

      const joinedMessages = messages.join("\n");
      console.log(`Info: ${joinedMessages}.`);
  },
};

const loggers = [consoleLogger];

const execute = function (cb, parameters) {
  for (let index = 0; index < loggers.length; index++) {
    const logger = loggers[index];
    if (logger.isEnabled) {
      cb(logger, parameters);
    }
  }
};

const buildUserInformation = (player, data, error) => {
  player = player || { UID: "Not found", profile: { name: "Not found" } };
  error = error || { name: "error not found", message: "message not found", stack: "stack not found" };
  data = data || {};

  const message = [
    `Player Id: ${player.UID}`,
    `Player Nickname: ${player.profile.name}`,
    `Data: ${JSON.stringify(data)}`,
    error.name,
    error.message,
    error.stack,
  ];

  return message;
};

module.exports = {
  start: () => {
    execute((logger, parameters) => {
      logger.start();
    });
  },
  log: (message, severity = "info") => {
    execute((logger, parameters) => {
      logger.log(parameters, severity);
    }, message);
  },
  logCritical: (exception) => {
    execute((logger, parameters) => {
      logger.logCritical && logger.logCritical(parameters);
    }, exception);
  },
  logWarning: (exception) => {
    execute((logger, parameters) => {
      logger.logWarning && logger.logWarning(parameters);
    }, exception);
  },
  logError: (exception) => {
    execute((logger, parameters) => {
      logger.logError(parameters);
    }, exception);
  },
  getLogger: () => {
    return consoleLogger;
  },
  buildUserInformation,
};
