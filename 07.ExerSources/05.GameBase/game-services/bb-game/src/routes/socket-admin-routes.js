import BaseAdminSocketRouter from "sc-game-base/src/core/routers/base-admin-socket-router";
import AdminSettlementResultConsumer from "../consumers/admin-settlement-result-consumer";
import { logger } from "sc-common";

export default class AdminSocketRouter extends BaseAdminSocketRouter {
  /**
   * @param {Object} options
   * @property gameData
   * @property definition
   * @property {string} adminSecretKey
   * @property {string} env
   * @property adminAuthenticationConsumer
   * @property adminMonitorConsumer
   * @property adminDisconnectConsumer
   * @property adminSettlementResultConsumer
   */
  constructor(options) {
    super(options.adminAuthenticationConsumer, options.adminMonitorConsumer, options.adminDisconnectConsumer);
    this.gameData = options.gameData;
    this.definition = options.definition;
    this.adminSecretKey = options.adminSecretKey;
    this.env = options.env;
    this.adminSettlementResultConsumer = options.adminSettlementResultConsumer ?? new AdminSettlementResultConsumer(options);
  }

  /**
   * @param {Object} payload
   * @property setResult
   * @return {Promise<void>}
   */
  async handleMessage(payload) {
    try {
      if (payload.authentication) {
        this.adminAuthenticationConsumer.consume(this.socketClient, this.gameData, payload.authentication.jwt, this.adminSecretKey);
      }

      if (!this.verify(payload)) {
        return;
      }

      if (payload[this.definition.name].get_new) {
        await this.adminMonitorConsumer.consume(this.socketClient, this.definition, this.gameData);
      }

      if (this.env !== "PRO" && payload[this.definition.name].setResult) {
        this.adminSettlementResultConsumer.consume(payload[this.definition.name].setResult);
        this.socketClient.emit(this.definition.name, {adminSettle: {success: true}})
      }
    } catch (err) {
      logger.logError(err);
    }
  }

  init(socketClient) {
    this.socketClient = socketClient;

    this.socketClient.on("message", this.handleMessage.bind(this));
    this.socketClient.on("disconnect", this.handleDisconnect.bind(this));
  }

  verify(payload) {
    return payload[this.definition.name] && !!this.gameData.admins[this.socketClient.id];
  }
}
