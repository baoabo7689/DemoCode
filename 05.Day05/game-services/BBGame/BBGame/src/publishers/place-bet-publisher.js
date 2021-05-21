import PlaceBetPublisher from "sc-game-base/src/core/event-publishers/place-bet-publisher";

export default class FishPrawnCrabProPlaceBetPublisher extends PlaceBetPublisher {
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
