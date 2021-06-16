using GamesAdmin.Core.Enumeration;
using GamesAdmin.Database.RetrieveEndGameInfo;
using System;
using System.Threading.Tasks;

namespace GamesAdmin.Api.RetrieveEndGameInfo
{
    public interface IRetrieveEndGameInfoService
    {
        Task<string> GetSiteId(int memberId, long gameRoundId, GameId gameType);
    }

    public class RetrieveEndGameInfoService : IRetrieveEndGameInfoService
    {
        private readonly IRetrieveEndGameInfoRepository repository;

        public RetrieveEndGameInfoService(IRetrieveEndGameInfoRepository repository)
        {
            this.repository = repository;
        }

        public async Task<string> GetSiteId(int memberId, long gameRoundId, GameId gameType)
        {
            switch (gameType)
            {
                case GameId.BolaTangkas:
                    return await repository.GetSiteIdForBolaAsync(memberId, gameRoundId);
                case GameId.Blackjack:
                    return await repository.GetSiteIdForBlackjackAsync(memberId, gameRoundId);
                default:
                    return await repository.GetSiteIdAsync(memberId, gameRoundId, gameType);
            }
        }
    }
}
