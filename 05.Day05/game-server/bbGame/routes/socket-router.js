import { Table } from "sc-game-base";
import { logger } from "sc-common";

import ChangeLanguageConsumer from "../consumers/change-language-consumer";
import GetGameConfigsConsumer from "../consumers/get-game-configs-consumer";

export default class SocketRouter extends Table.Routers.SocketRouter {
 
    constructor(
        definition,
        gameData,
        userSignInConsumer = null,
        userDisconnectConsumer = null,
        inGameConsumer = null,
        userSignInPublisher = null,
        historyQuery = null,
        roundQuery = null,
        placeBetConsumer = null
    ) {
        super({
            definition,
            gameData,
            userSignInConsumer,
            userDisconnectConsumer,
            inGameConsumer,
            placeBetConsumer,
            userSignInPublisher,
            historyQuery,
            roundQuery,
        });

        this.changeLanguageConsumer = new ChangeLanguageConsumer();    
        this.getGameConfigsConsumer = new GetGameConfigsConsumer({definition});   

        this.inGameConsumer = inGameConsumer;
        this.placeBetConsumer = placeBetConsumer;
    }

    /**
     * @param {SocketIO.Socket} socketClient
     */
    init(socketClient) {
        super.init(socketClient);

        this.socketClient.on("changeLanguage", this.handleChangeLanguage.bind(this));
        this.socketClient.on("getGameConfigs", this.handleGetGameConfigs.bind(this));
    }

    /**
     * @param {{language: string}} payload
     */
    handleChangeLanguage(payload) {
        try {
            if (this.verify(payload)) {
                this.changeLanguageConsumer.consume(this.gameData.realPlayers[this.socketClient.id], payload);
            }
        } catch (error) {
            logger.logError(error);
        }
    }

    async handleGetGameConfigs() {
        try {
            await this.getGameConfigsConsumer.consumeAsync(this.gameData.realPlayers[this.socketClient.id]);
        } catch (error) {
            logger.logError(error);
        }
    }

    handlePlaceBet(payload) {
        try {
            if (!this.verify()) {
                return;
            }

            this.placeBetConsumer.consume(this.gameData.realPlayers[this.socketClient.id], payload);
        } catch (error) {
            logger.logError(error);
        }
    }
}
