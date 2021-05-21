import { Core } from "sc-game-base";

export default class PlaceBetPublisher extends Core.BaseEventPublishers.PlaceBetPublisher {
  publishSuccessBet(playerId, payload) {
    super.publishSuccessBet(playerId, payload);

    const otherUsersPayload = {
      playerId,
      choices: { ...payload.ownChip },
      ...payload.user,
    };

    this.publishToAllUsersExcept(playerId, { playerChip: otherUsersPayload });
  }
}
