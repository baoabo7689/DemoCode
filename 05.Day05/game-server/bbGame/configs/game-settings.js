const appConfigs = require("./appConfigs.json");

const gameSettings = {
  id: 1,
  name: appConfigs.gameName,
  durations: {
    wholeRound: 60
  }
};
export { gameSettings };