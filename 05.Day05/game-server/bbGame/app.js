import { Table } from "sc-game-base";
import { logger } from "sc-common";

import {appConfigs, gameSettings} from "./configs";
import { Bets } from "./models/bets";
import { Rounds } from "./models/rounds";
import Startup from "./startup";
import MarketManagement from "@nex3/market-management";
import GameCron from "./cron/game-cron";
import RoundResultPublisher from "./publishers/round-result-publisher";
import SettleGameConsumer from "./consumers/settle-game-consumer";
import Bot from "./cron/bot";
import ProcessBetQueue from "./cron/process-bet-queue";
import { generateResult, getSettlementResult } from "./helpers/result-helper";

export class BBGameApp extends Table.TableGameApp {}

const run = async () => {
  const startupMessage = `'${gameSettings.name}' has been started at ${new Date()}`;
  logger.log(startupMessage);
  console.log(startupMessage);

  const gameData = new Table.TableGameData(gameSettings.durations.wholeRound);
  const definition = new Table.TableGameDefinition(gameSettings, generateResult, getSettlementResult, Rounds, Bets, null);  
  const roundPublisher = new RoundResultPublisher(gameSettings.name, gameData);
  const settleGameConsumer = new SettleGameConsumer(definition, gameData, roundPublisher);
  const gameCron = new GameCron(definition, gameData, new Bot(gameSettings.name, gameData), settleGameConsumer);

  const startup = new Startup(
    appConfigs,
    definition,
    gameData,
    gameCron,
    new ProcessBetQueue(definition, gameData, settleGameConsumer)
  );

  const app = new BBGameApp(appConfigs, definition, gameData, startup);
  await app.run();

  MarketManagement.init(appConfigs.marketConfigCacheTimeout);
};

run();
































