let configDB = require("../../config/appConfigs").mongoDBConfig;

let mongoose = require("mongoose");
const logger = require("./logger").getLogger();
require("mongoose-long")(mongoose); // INT 64bit

function connectDatabase(callback) {
  mongoose.set("useFindAndModify", false);
  mongoose.set("useCreateIndex", true);
  mongoose.connect(configDB.url, configDB.options).catch(function (error) {
    if (error) {
      console.log("Connect to MongoDB failed", error);
    } else {
      console.log("Connect to MongoDB success");
    }

    logger.logError(error);
  });

  mongoose.connection.on("connected", () => {
    const message = `MongoDB connected.`;
    logger.log(message);

    callback && callback();
  });

  mongoose.connection.on("disconnected", () => {
    logger.logWarning(`MongoDB disconnected at ${new Date()}`);
  });

  mongoose.connection.on("error", (err) => {
    logger.logError(err);
  });
}

module.exports = connectDatabase;
