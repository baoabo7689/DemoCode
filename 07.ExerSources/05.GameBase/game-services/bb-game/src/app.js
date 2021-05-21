import { Table } from "sc-game-base";
import { logger } from "sc-common";

import appConfigs from "./configs";
import constants from "./constants";
import ProcessBetQueue from "./cron/process-bet-queue";
import FishPrawnCrabProBot from "./cron/bot";
import gameSettings from "./configs/game-settings";
import { generateResult, getSettlementResult } from "./helpers/result-helper";
import { FishPrawnCrabProBets, FishPrawnCrabProTmpBets } from "./models/fish-prawn-crab-pro-bets";
import FishPrawnCrabProRound from "./models/fish-prawn-crab-pro-rounds";
import Startup from "./startup";
import MarketManagement from "@nex3/market-management";
import SettlementGameRoundConsumer from "./consumers/settle-game-round-consumer";

export class App extends Table.TableGameApp {}

const run = async () => {
  const startupMessage = `'${gameSettings.name}' has been started at ${new Date()}`;

  logger.log(startupMessage);
  console.log(startupMessage);
  
  const gameData = new Table.TableGameData(constants.roundDuration, constants.resetTotalBets);
  const definition = new Table.TableGameDefinition(
    gameSettings,
    generateResult,
    getSettlementResult,
    FishPrawnCrabProRound,
    FishPrawnCrabProBets,
    FishPrawnCrabProTmpBets
  );

  const bot = new FishPrawnCrabProBot(definition, gameData);
  const settlementConsumer = new SettlementGameRoundConsumer(definition, gameData);
  const processBetQueue = new ProcessBetQueue(definition, gameData);

  const gameCron = new Table.TableGameCron(definition, gameData, bot, settlementConsumer);
  const startup = new Startup(appConfigs, definition, gameData, gameCron, processBetQueue);

  const app = new App(appConfigs, definition, gameData, startup);
  await app.run();

  MarketManagement.init(appConfigs.marketConfigCacheTimeout);
}


run();


