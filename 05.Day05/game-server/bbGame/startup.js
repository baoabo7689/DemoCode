import { Table } from "sc-game-base";

import InGameConsumer from "./consumers/ingame-consumer";
import OutGameConsumer from "./consumers/outgame-consumer";
import PlaceBetConsumer from "./consumers/place-bet-consumer";

import initDatabase from "./models";
import HistoryQuery from "./query-apis/history-query";
import SocketRouter from "./routes/socket-router";
import HttpRouter from "./routes/http-router";

export default class Startup extends Table.TableGameStartup {
    initHttpRouter(app) {
        new HttpRouter(this.gameData).init(app, this.appConfigs);
    }
    
    /**
     * @param {socketIo.Socket} socketClient
     */
    initSocketRouter(socketClient) {
        const router = new SocketRouter(
            this.definition,
            this.gameData,
            null,
            new OutGameConsumer(this.definition, this.gameData),
            new InGameConsumer({ definition: this.definition, gameData: this.gameData, roundQuery: null, publisher: null }),
            null,
            new HistoryQuery(this.definition),
            null,
            new PlaceBetConsumer(this.definition, this.gameData)
        );

        router.init(socketClient);
    }

    async configureServices(app) {
        super.configureServices(app);

        await initDatabase(this.appConfigs.database);
    }
}
