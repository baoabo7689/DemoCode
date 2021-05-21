import getRandomFunction from "./random";

const buildRules = (key, condition, min = 1, max = 6) =>
  [...Array(max - min + 1)].map((_, index) => ({ choice: `${key}${min + index}`, condition: condition(min + index) }));

const buildCondition = (regexBuilder) => (value) => (dices) => {
  const regex = new RegExp(regexBuilder(value, dices), "g");
  const dicesString = [...dices].sort().join("");

  return dicesString.match(regex)?.length >> 0;
};

const anyTripleCondition = buildCondition(() => "111|222|333|444|555|666")();
const groundWaterCondition = (dices, groundWaterFilter) => dices.filter(groundWaterFilter).length >= 2;

const settlementRuleEntries = [
  {
    choice: "ground",
    condition: (dices) => groundWaterCondition(dices, (dice) => dice % 2 === 0) >> 0,
  },
  {
    choice: "water",
    condition: (dices) => groundWaterCondition(dices, (dice) => dice % 2 === 1) >> 0,
  },
  {
    choice: "anyTriple",
    condition: anyTripleCondition,
  },
  ...buildRules(
    "single",
    buildCondition((value) => `${value}`)
  ),
  ...buildRules(
    "double",
    buildCondition((value) => `.*${value}${value}.*`)
  ),
  ...buildRules(
    "triple",
    buildCondition((value) => `${value}${value}${value}`)
  ),
  ...buildRules(
    "combination1",
    buildCondition((value) => `.*1.*${value}.*`),
    2
  ),
  ...buildRules(
    "combination2",
    buildCondition((value) => `.*2.*${value}.*`),
    3
  ),
  ...buildRules(
    "combination3",
    buildCondition((value) => `.*3.*${value}.*`),
    4
  ),
  ...buildRules(
    "combination4",
    buildCondition((value) => `.*4.*${value}.*`),
    5
  ),
  ...buildRules(
    "combination5",
    buildCondition((value) => `.*5.*${value}.*`),
    6
  ),
];

export const generateResult = () => {
  const range = (min, max) => getRandomFunction().range(min, max);

  const results = [...Array(100).keys()].map(() => ({
    dice1: range(1, 6),
    dice2: range(1, 6),
    dice3: range(1, 6),
  }));

  const index = range(0, 99);

  return results[index];
};

export const getSettlementResult = (roundResult) => {
  const { dice1, dice2, dice3 } = roundResult;

  return Object.assign({}, ...settlementRuleEntries.map((rule) => ({ [rule.choice]: rule.condition([dice1, dice2, dice3]) })));
};
