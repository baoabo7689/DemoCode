import { logger } from "sc-common";

import { BaseSocketRouter } from "sc-game-base/src/core/routers";

export default class SocketRouter extends BaseSocketRouter {
    constructor({
        definition,
        gameData,
        userSignInConsumer,
        inGameConsumer,
        placeBetConsumer,
        userDisconnectConsumer,
        userSignInPublisher,
        historyQuery,
        logService,
        getGameConfigsConsumer,
    }) {
        super({
            definition,
            gameData,
            userSignInConsumer,
            inGameConsumer,
            placeBetConsumer,
            userDisconnectConsumer,
            userSignInPublisher,
            historyQuery,
            logService,
        });

        this.getGameConfigsConsumer = getGameConfigsConsumer;
    }

    /**
     * @param {SocketIO.Socket} socketClient
     */
    init(socketClient) {
        super.init(socketClient);

        this.socketClient.on("getGameConfigs", this.handleGetGameConfigs.bind(this));
    }

    async handleGetGameConfigs() {
        try {
            await this.getGameConfigsConsumer.consume(this.gameData.realPlayers[this.socketClient.id]);
        } catch (error) {
            logger.logError(error);
        }
    }
}
