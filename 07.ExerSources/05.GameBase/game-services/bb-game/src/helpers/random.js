import Chance from "chance";
import randomLib from "random";
import RandomJS from "random-js";

const chance = () => {
  const chanceRandom = new Chance();
  const range = (min, max) => chanceRandom.integer({ min, max });
  const bool = () => chanceRandom.bool();

  return {
    range,
    bool,
  };
};

const random = () => {
  const range = (min, max) => randomLib.int(min, max);
  const bool = () => randomLib.bool();

  return {
    range,
    bool,
  };
};

const randomJs = () => {
  const randomJs = new RandomJS.Random(RandomJS.MersenneTwister19937.autoSeed());
  const range = (min, max) => randomJs.integer(min, max);
  const bool = () => randomJs.bool();

  return {
    range,
    bool,
  };
};

const supportedRandomFunctions = [
  {
    name: "chance",
    random: chance,
  },
  {
    name: "random",
    random: random,
  },
  {
    name: "random-js",
    random: randomJs,
  },
];

const getSupportedRandomFunction = () => {
  const selectedRandomMethodIndex = Math.floor(Math.random() * supportedRandomFunctions.length) >> 0;
  const randomFunction = supportedRandomFunctions[selectedRandomMethodIndex];

  return randomFunction.random();
};

/**
 *
 * @param {String?} libraryName Supported: random, random-js, chance
 */
const getRandomFunction = (libraryName) => {
  const index = supportedRandomFunctions.findIndex((fun) => fun.name === libraryName);

  if (index !== -1) {
    const randomFunction = supportedRandomFunctions[index];

    return randomFunction.random();
  } else {
    return getSupportedRandomFunction();
  }
};

export default getRandomFunction;
