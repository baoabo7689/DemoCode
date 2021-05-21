import { Table } from "sc-game-base";
import { logger } from "sc-common";
import ChangeLanguageConsumer from "../consumers/change-language-consumer";
import GetGameConfigsConsumer from "../consumers/get-game-configs-consumer";

/**
 * @typedef {Object} FishPrawnCrabProSocketRouterOptions
 * @property definition
 * @property gameData
 * @property userSignInConsumer
 * @property userDisconnectConsumer
 * @property inGameConsumer
 * @property placeBetConsumer
 * @property userSignInPublisher
 * @property historyQuery
 * @property roundQuery
 * @property {ChangeLanguageConsumer} changeLanguageConsumer
 * @property {GetGameConfigsConsumer} getGameConfigsConsumer
 */

export default class FishPrawnCrabProSocketRouter extends Table.Routers.SocketRouter {
  /**
   * @param {FishPrawnCrabProSocketRouterOptions} options
   */
  constructor(options) {
    super(options);
    this.changeLanguageConsumer = options?.changeLanguageConsumer ?? new ChangeLanguageConsumer();
    this.getGameConfigsConsumer = options?.getGameConfigsConsumer ?? new GetGameConfigsConsumer(options);
  }

  /**
   * @param {SocketIO.Socket} socketClient
   */
  init(socketClient) {
    super.init(socketClient);

    this.socketClient.on("changeLanguage", this.handleChangeLanguage.bind(this));
    this.socketClient.on("getGameConfigs", this.handleGetGameConfigs.bind(this));
    this.socketClient.on("testMethod", (data) => {
      console.log("BB Here 2")
    });
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

  async handlePlaceBet(payload) {
    try {
      if (!this.verify()) {
        return;
      }

      await this.placeBetConsumer.consume(this.gameData.realPlayers[this.socketClient.id], payload);
    } catch (error) {
      logger.logError(error);
    }
  }

  async handleGetHistory(payload) {
    try {
      if (!this.verify()) {
        return;
      }

      const history = await this.historyQuery.queryHistory(this.gameData.realPlayers[this.socketClient.id], payload);

      this.socketClient.emit(this.definition.name, history);
    } catch (error) {
      logger.logError(error);
    }
  }
}
