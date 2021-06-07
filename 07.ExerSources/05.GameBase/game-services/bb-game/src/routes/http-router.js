import TableHttpRouter from "sc-game-base/src/table/routers/table-http-router";
import { logger } from "sc-common";

export default class HttpRouter extends TableHttpRouter {
  init(app, appConfigs) {
    super.init(app, appConfigs);

    app.post("/set-result", this.handleSetResult(appConfigs));

    if (appConfigs.env !== "PRO") {
      app.get("/game-data", this.handleGetGameData());
    }
  }

  handleSetResult(appConfig) {
    return (req, res) => {
      if (appConfig.env === "PRO" || appConfig.env === "UAT") {
        res.sendStatus(404);
        return;
      }
      
      this.gameData.settlementResultFromAdmin = {
        roundId: parseInt(req.query.roundId),
        result: {
          dice1: req.query.dice1,
          dice2: req.query.dice2,
          dice3: req.query.dice3
        } 
      };

      logger.logError(`Set result from api: ${JSON.stringify(this.gameData.settlementResultFromAdmin)}`);
      res.send({ settlementResultFromAdmin: this.gameData.settlementResultFromAdmin });
    };
  }

  handleGetGameData() {
    return (req, res) => {
      const { players } = this.gameData;

      const listBots = Object.values(players).filter((player) => player.type);
      const remainingTickets = listBots.reduce((total, bot) => total + bot.remainTickets, 0);
      const bot = {
        remainingTickets,
        counts: listBots.length,
        list: listBots,
      };

      res.send({ bot });
    };
  }
}
