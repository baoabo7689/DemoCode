namespace GamesAdmin.Site.Features.GameRoundResult
{
    using GamesAdmin.Site.Features.GameRoundResult.Requests;
    using GamesAdmin.Site.Features.GameRoundResult.ViewModels;
    using Refit;
    using System.Threading.Tasks;

    public interface IGameRoundResultAPI
    {
        [Post("/GameRoundResult/GetAccessUrl")]
        Task<GameRoundResultResponse> GetToken([Body(BodySerializationMethod.Serialized)]GetUrlAccessRequest request);
    }
    public interface IGameRoundResultService
    {
        Task<GameRoundResultResponse> GetUrlAccess(GetUrlAccessRequest request);
    }

    public class GameRoundResultService : IGameRoundResultService
    {
        
        private readonly IGameRoundResultAPI gameRoundResultAPI;       

        public GameRoundResultService(IGameRoundResultAPI gameRoundResultAPI)
        {
            this.gameRoundResultAPI = gameRoundResultAPI;
        }

        public async Task<GameRoundResultResponse> GetUrlAccess(GetUrlAccessRequest request)
        {
            return await this.gameRoundResultAPI.GetToken(request);
        }
    }
}
