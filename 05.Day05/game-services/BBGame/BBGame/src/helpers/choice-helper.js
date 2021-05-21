const getArrayOfChoice = (key, min = 1, max = 6) => [...Array(max - min + 1)].map((_, index) => `${key}${min + index}`);

export const choices = [
  "ground",
  "water",
  ...getArrayOfChoice("single"),
  ...getArrayOfChoice("double"),
  "anyTriple",
  ...getArrayOfChoice("triple"),
  ...getArrayOfChoice("combination1", 2),
  ...getArrayOfChoice("combination2", 3),
  ...getArrayOfChoice("combination3", 4),
  ...getArrayOfChoice("combination4", 5),
  ...getArrayOfChoice("combination5", 6),
];

export const configMapping = {
  environment: ["ground", "water"],
  anyTriple: ["anyTriple"],
  specificTriple: getArrayOfChoice("triple"),
  specificDouble: getArrayOfChoice("double"),
  singleSymbol: getArrayOfChoice("single"),
  oneSymbol: getArrayOfChoice("single1"),
  twoSymbol: getArrayOfChoice("single2"),
  threeSymbol: getArrayOfChoice("single3"),
  pairCombination: [
    ...getArrayOfChoice("combination1", 2),
    ...getArrayOfChoice("combination2", 3),
    ...getArrayOfChoice("combination3", 4),
    ...getArrayOfChoice("combination4", 5),
    ...getArrayOfChoice("combination5", 6),
  ],
};

export const setValueToChoices = (value) => Object.assign({}, ...choices.map((key) => ({ [key]: value })));

export const convertAdminConfigToChoices = (oddConfigs) =>
  Object.assign(
    {},
    ...Object.keys(oddConfigs).flatMap((configKey) => configMapping[configKey].map((key) => ({ [key]: oddConfigs[configKey] })))
  );
