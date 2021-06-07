import appConfigs from "./appConfigs.json";

export default  {
  id: 1,
  name: appConfigs.gameName,
  durations: {
    wholeRound: 20,
    placingBets: 15,
    lockingBet: 5,
    rollTheDiceDuration: 3
  },
  choices: ["stag", "gourd", "rooster", "fish", "crab", "prawn"]
};