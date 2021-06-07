import { setValueToChoices } from "./helpers/choice-helper";

export default {
  roundDuration: 20,
  placingBetDuration: 15,
  settlementDuration: 5,
  resetTotalBets: setValueToChoices(0),
  chips: [10, 50, 100, 200, 500, 1000]
};
