import _ from "lodash";
import BigSmall from "./big-small/big-small";
import BigSmallTurbo from "./big-small-turbo/big-small-turbo";
import DragonTiger from "./dragon-tiger/dragon-tiger";
import FishPrawnCrab from "./fish-prawn-crab/fish-prawn-crab";
import KenoProMax from "./keno-pro-max/keno-pro-max";
import OddEven from "./odd-even/odd-even";
import OddEvenTurbo from "./odd-even-turbo/odd-even-turbo";
import ShakeThePlate from "./shake-the-plate/shake-the-plate";
import SicBo from "./sicbo/sicbo";
import Baccarat from "./baccarat";
import Roulette from "./roulette";
import gameNameMapper from "./game-name-mapper";
import MiniKeno from './mini-keno/index';

const getObjectOfGame = (path: string) => (onMessage: Function) => (message: any) => {
  const object = _.get(message, path);
  onMessage && onMessage(object);
};

const getInfoByGameKey = (key: string) => {
  const data = {
    selector: (message) => message[key] != null,
    onMessage: getObjectOfGame(key),
    initialMessage: {},
    endMessage: {},
    generateMessage: (data: any) => {
      const message = {};
      message[key] = data;
     
      return message;
    },
  };

  data.initialMessage[key] = { get_time: true, view: true, get_new: true, sync: true };
  data.endMessage[key] = { view: false };

  return data;
};

const gameMapper = {
  1: {
    component: BigSmall,
    ...getInfoByGameKey("TaiXiu"),
  },
  2: {
    component: ShakeThePlate,
    ...getInfoByGameKey("xocxoc"),
  },
  3: {
    component: FishPrawnCrab,
    ...getInfoByGameKey("baucua"),
  },
  4: {
    component: BigSmallTurbo,
    ...getInfoByGameKey("TaiXiuTurbo"),
  },
  5: {
    component: OddEven,
    ...getInfoByGameKey("ChanLe"),
  },
  6: {
    component: OddEvenTurbo,
    ...getInfoByGameKey("ChanLeTurbo"),
  },
  7: {
    component: DragonTiger,
    ...getInfoByGameKey("mini_dragon_tiger"),
  },
  8: {
    component: KenoProMax,
    ...getInfoByGameKey("kenoProMax"),
  },
  10: {
    component: Baccarat,
    ...getInfoByGameKey("baccarat"),
  },
  21: {
    component: Roulette,
    ...getInfoByGameKey("roulette"),
  },
  25: {
    component: SicBo,
    ...getInfoByGameKey("SicBo"),
  },
  12: {
    component: MiniKeno('kenoMax', 20),
    ...getInfoByGameKey('kenoMax')
  },
  13: {
    component: MiniKeno('kenoMax2', 20),
    ...getInfoByGameKey('kenoMax2')
  },
  14: {
    component: MiniKeno('kenoMini', 10),
    ...getInfoByGameKey('kenoMini')
  },
  15: {
    component: MiniKeno('kenoMini2', 10),
    ...getInfoByGameKey('kenoMini2')
  },
  16: {
    component: MiniKeno('kenoEast', 20),
    ...getInfoByGameKey('kenoEast')
  },
  17: {
    component: MiniKeno('kenoWest', 20),
    ...getInfoByGameKey('kenoWest')
  },
  18: {
    component: MiniKeno('kenoSouth', 20),
    ...getInfoByGameKey('kenoSouth')
  },
  19: {
    component: MiniKeno('kenoNorth', 20),
    ...getInfoByGameKey('kenoNorth')
  },
};

export function getGameInfoByGameId(gameId: number | string) {
  return gameMapper[gameId];
}

export function getGameInfoByGameName(gameName: string) {
  return gameMapper[gameNameMapper[gameName]];
}

export type GameMonitoringInfo = {
  component: any;
  selector: (message: any) => boolean;
  onMessage: (callback: (message: any) => any) => Function;
  initialMessage: object;
  endMessage: object;
  generateMessage: (data: any) => object;
};