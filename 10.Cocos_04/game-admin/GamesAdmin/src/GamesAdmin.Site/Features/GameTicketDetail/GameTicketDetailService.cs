namespace GamesAdmin.Site.Features.GameTicketDetail
{
    using GamesAdmin.Site.Features.GameTicketDetail.Requests;
    using GamesAdmin.Site.Features.GameTicketDetail.ViewModels;
    using Refit;
    using System.Threading.Tasks;

    public interface IGameTicketDetailAPI
    {
        [Post("/GameTicket/GetAccessUrl")]
        Task<GameTicketDetailReponse> GetToken([Body(BodySerializationMethod.Serialized)] GetUrlAccessRequest request);
    }

    public interface IGameTicketDetailService
    {
        Task<GameTicketDetailReponse> GetUrlAccess(GetUrlAccessRequest request);
    }

    public class GameTicketDetailService : IGameTicketDetailService
    {
        private readonly IGameTicketDetailAPI gameTicketDetailAPI;

        public GameTicketDetailService(IGameTicketDetailAPI gameTicketDetailAPI)
        {
            this.gameTicketDetailAPI = gameTicketDetailAPI;
        }

        public Task<GameTicketDetailReponse> GetUrlAccess(GetUrlAccessRequest request)
        {
            return this.gameTicketDetailAPI.GetToken(request);
        }
    }
}
