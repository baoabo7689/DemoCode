import { getBalance } from "sc-base-apis";
import BaseInGameConsumer from "sc-game-base/src/core/event-consumers/in-game-consumer";
import MarketManagement from "@nex3/market-management";

export default class InGameConsumer extends BaseInGameConsumer {
  async consume(realPlayer) {
    await super.consume(realPlayer);
    await this.publishSignedInPlayer(realPlayer);
    this.publishPlayersInGame(realPlayer);
  }
 
  async buildPayload(realPlayer) {
    const marketManagement = MarketManagement.getInstance();
    const marketConfig = await marketManagement.getGameMarketConfig(
      this.definition.id,
      realPlayer.session.currency,
      realPlayer?.session?.language
    );

    const maxNumberOfRounds = 100;
    const { totalBets } = this.gameData;
    const gameConfig = {
      minBet: marketConfig.minBet,
      maxBet: marketConfig.maxBet,
      maxBetChoices: marketConfig.maxBetChoices,
      odds: marketConfig.odds,
    };
    const { betTracks: ownBets } = this.gameData.ingame[realPlayer.profile.name] || { betTracks: {} };
    const roundHistory = await this.roundQuery.getList(maxNumberOfRounds);
    const latestBet = await this.roundQuery.getLatestBet(realPlayer.UID);

    await getBalance(realPlayer, true);

    const user = await this.getUserInfo(realPlayer.UID);

    return {
      gameConfig,
      roundHistory,
      ownBets,
      totalBets,
      user,
      latestBet,
    };
  }

  async publishSignedInPlayer(realPlayer) {
    const user = await this.getUserInfo(realPlayer.UID);

    this.storePlayerInGame(realPlayer, user);

    const payload = {
      player: {
        avatarId: user.avatarId,
        id: realPlayer.UID,
        name: user.name,
        red: user.red,
        type: user.type,
      },
    };

    this.publisher.publishToAllUsersExcept(realPlayer.UID, payload);
  }

  publishPlayersInGame(realPlayer) {
    const players = Object.assign({}, this.gameData.players, { [realPlayer.UID]: undefined });

    this.publisher.publishToUser(realPlayer.UID, { players });
  }

  storePlayerInGame(realPlayer, user) {
    user && (this.gameData.players[realPlayer.UID] = Object.assign({}, user, { id: realPlayer.UID }));
  }
}
