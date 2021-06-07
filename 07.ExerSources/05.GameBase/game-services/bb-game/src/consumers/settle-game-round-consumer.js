import TableSettlementGameRoundConsumer from "sc-game-base/src/table/event-consumers/table-settle-game-round-consumer";
import { convertAdminConfigToChoices } from "../helpers/choice-helper";

export default class FishPrawnCrabProSettleGameRoundConsumer extends TableSettlementGameRoundConsumer {
  calculateBetResult(settlementResult, bet, odds) {
    const normalizedOdds = convertAdminConfigToChoices(odds);
  
    const betResult = Object.entries(settlementResult).reduce(
      (result, [choice, win]) => {
        const oddChoice = choice.startsWith("single") ? `single${win}${choice.substr("single".length)}` : choice;
        const betAmount = bet[choice];
        const originalOdds = normalizedOdds[oddChoice] || 1;
        const effectiveOdds = bet.freeBet ? originalOdds - 1 : originalOdds;
        const winAmount = win ? betAmount * effectiveOdds : 0;

        result.totalBetAmount += betAmount;
        result.totalWin += winAmount;
        result.winningByChoices[choice] = winAmount;

        if (winAmount > 0) {
          result.netWin += winAmount - betAmount;
        } else {
          result.totalLost += betAmount;
        }

        return result;
      },
      {
        totalBetAmount: 0,
        totalWin: 0,
        netWin: 0,
        totalLost: 0,
        winningByChoices: {},
      }
    );

    betResult.totalWin = parseFloat(betResult.totalWin.toFixed(2));
    betResult.netWin = parseFloat(betResult.netWin.toFixed(2));

    return betResult;
  }

  collectRoundResult(result, settlementResult, roundId) {
    const roundResult = super.collectRoundResult(result, settlementResult, roundId);

    Object.keys(roundResult.winningPlayers).forEach((playerId) => {
      const playerInfo = this.gameData.players[playerId];

      if (playerInfo) {
        Object.assign(roundResult.winningPlayers[playerId], { currency: playerInfo.currency });
      }
    });

    return roundResult;
  }
}
