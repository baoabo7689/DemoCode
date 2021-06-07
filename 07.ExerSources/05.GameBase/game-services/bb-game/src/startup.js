import { Table } from "sc-game-base";

import PlaceBetConsumer from "./consumers/place-bet-consumer";
import IngameConsumer from "./consumers/ingame-consumer";
import UserSignInConsumer from "./consumers/user-signin-consumer";

import initDatabase from "./models";
import { FishPrawnCrabProHistoryQuery, FishPrawnCrabProRoundQuery } from "./query-apis";
import SocketRouter from "./routes/socket-routes";
import AdminSocketRouter from "./routes/socket-admin-routes";
import HttpRouter from "./routes/http-router";
import cors from 'cors';

export default class Startup extends Table.TableGameStartup {
  initHttpRouter(app) {
    new HttpRouter(this.gameData).init(app, this.appConfigs);
  }

  initSocketRouter(socketClient) {
    const roundQuery = new FishPrawnCrabProRoundQuery(this.definition);
    const ingameOptions = {
      definition: this.definition,
      gameData: this.gameData,
      roundQuery,
    };

    const socketRouterOptions = {
      definition: this.definition,
      gameData: this.gameData,
      placeBetConsumer: new PlaceBetConsumer(this.definition, this.gameData),
      historyQuery: new FishPrawnCrabProHistoryQuery(this.definition, roundQuery),
      roundQuery,
      inGameConsumer: new IngameConsumer(ingameOptions),
      userSignInConsumer: new UserSignInConsumer(this.definition, this.gameData),
    };

    const router = new SocketRouter(socketRouterOptions);

    router.init(socketClient);
  }

  initAdminSocketRouter(socketClient) {
    const socketRouterOptions = {
      definition: this.definition,
      gameData: this.gameData,
      adminSecretKey: this.appConfigs.adminSecretKey,
      env: this.appConfigs.env,
    };

    const router = new AdminSocketRouter(socketRouterOptions);

    router.init(socketClient);
  }

  async configureServices(app) {
    super.configureServices(app);
    app.use(cors())

    await initDatabase(this.appConfigs.database);
  }
}
