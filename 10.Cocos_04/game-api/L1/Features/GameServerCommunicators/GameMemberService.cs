using System.Threading.Tasks;
using L1.Features.GameServerCommunicators.DailySummary;
using L1.Features.GameServerCommunicators.RetrieveEndGameInfo;

namespace L1.Features.GameServerCommunicators
{
    public interface IGameMemberService
    {
        Task<GameServerResponse<RetrieveEndGameInfoResult>> RetrieveEndGameInfoAsync(RetrieveEndGameInfoRequest request);

        Task<GameServerResponse<DailySummaryResult>> DailySummary(DailySummaryRequest request);
    }

    public class GameMemberService : IGameMemberService
    {
        private readonly IGameServerService gameServerService;
        private readonly GameServerEndPoints gameServerEndPoints;

        public GameMemberService(IGameServerService gameServerService, GameServerEndPoints gameServerEndPoints)
        {
            this.gameServerService = gameServerService;
            this.gameServerEndPoints = gameServerEndPoints;
        }

        public Task<GameServerResponse<RetrieveEndGameInfoResult>> RetrieveEndGameInfoAsync(RetrieveEndGameInfoRequest request)
            => gameServerService.Post<RetrieveEndGameInfoResult>(gameServerEndPoints.RetrieveEndGameInfo, request);

        public Task<GameServerResponse<DailySummaryResult>> DailySummary(DailySummaryRequest request)
            => gameServerService.Post<DailySummaryResult>(gameServerEndPoints.DailySummary, request);
    }
}