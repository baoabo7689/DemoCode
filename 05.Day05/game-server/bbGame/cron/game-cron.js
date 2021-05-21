import cron from "cron";
import { logger } from "sc-common";
import { Core } from "sc-game-base";

export default class GameCron extends Core.Cron.BaseGameCron {
  constructor(definition, gameData, bot, settleGameConsumer) {
    super(definition, gameData, bot, settleGameConsumer);
  }

  async start() {
    const job = new cron.CronJob(
      "* * * * * *",
      () => this.proceed().catch(logger.logError),
      () => {
        logger.logError(`${this.definition.name} unexpectedly stopped because some other tasks halt it.`);
        job.start();
      }
    );    

    job.start();
  }
  
  async proceed() {
    
  }
}
