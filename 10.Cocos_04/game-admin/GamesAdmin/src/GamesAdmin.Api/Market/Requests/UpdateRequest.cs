using MediatR;

namespace GamesAdmin.Api.Market.Requests
{
    public class UpdateRequest : IRequest<bool>
    {
        public Core.Models.Market Market { get; set; }

        public UpdateRequest(Core.Models.Market market)
        {
            this.Market = market;
        }
    }
}
