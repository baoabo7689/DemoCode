import BaseUserSignInConsumer from "sc-game-base/src/table/event-consumers/table-user-signin-consumer";
import Translation from "@nex3/translation";

export default class UserSignInConsumer extends BaseUserSignInConsumer {
  async consume(socketClient, payload) {
    const configs = this.gameData.gameConfigs;
    const configuredDisabled = !configs || !configs.enabled;
    const disabled = configuredDisabled || this.gameData.delayStartTime > 0;

    if (!disabled) {
      await super.consume(socketClient, payload);
    } else {
      const translation = Translation.getInstance(payload?.language);
      const umMessage = configs?.disabled_message ?? "";
      const notice = { title: translation.t(translation.keys.notice), text: umMessage, load: false };

      this.userSigninPublisher.publishUmNotice(socketClient, notice);
    }
  }
}
