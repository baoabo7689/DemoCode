export default class ChangeLanguageConsumer {
  /**
   * @param {{session: {language: string}}} realPlayerData
   * @param {{language?: string}} payload
   */
  consume(realPlayerData, payload) {
    realPlayerData.session.language = payload?.language || "en";
  }
}
