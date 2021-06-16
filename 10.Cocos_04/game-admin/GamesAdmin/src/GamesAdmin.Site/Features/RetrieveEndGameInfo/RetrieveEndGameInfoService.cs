using GamesAdmin.Site.Features.RetrieveEndGameInfo.Requests;
using GamesAdmin.Site.Features.RetrieveEndGameInfo.ViewModels;
using System.Threading.Tasks;

namespace GamesAdmin.Site.Features.RetrieveEndGameInfo
{
    public interface IRetrieveEndGameInfoService
    {
        Task<string> GetSiteId(GetSiteIdRequest request);

        Task<EndGameInfoViewResult> CallRetrieveEndGameInfo(RetrieveEndGameRequest request);
    }

    public class RetrieveEndGameInfoService : IRetrieveEndGameInfoService
    {
        private readonly IRetrieveEndGameInfoApi retrieveEndGameApi;
        private readonly IGameApi gameApi;

        public RetrieveEndGameInfoService(IRetrieveEndGameInfoApi retrieveEndGameApi, IGameApi gameApi)
        {
            this.retrieveEndGameApi = retrieveEndGameApi;
            this.gameApi = gameApi;
        }

        public Task<EndGameInfoViewResult> CallRetrieveEndGameInfo(RetrieveEndGameRequest request)
        {
            return this.gameApi.CallRetrieveEndGameInfo(request);
        }

        public Task<string> GetSiteId(GetSiteIdRequest request)
        {
            return this.retrieveEndGameApi.GetSiteId(request.MemberId, request.GameRoundId, request.GameType);
        }
    }
}
