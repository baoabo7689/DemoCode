import getRandomFunction from "./random";

export const generateResult = () => {
  let betOptions = ["bau", "ca", "cua", "ga", "ho", "tom"];
  const rnd = getRandomFunction("random");
	let result = [1, 2, 3].map(r => betOptions[rnd.range(0, 5)]);

  return { 
    dice1: result[0], 
    dice2: result[1], 
    dice3: result[2] 
  };
};

export const getSettlementResult = (roundResult) => {
  return roundResult;
};
