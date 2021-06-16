using MediatR;

namespace GamesAdmin.Api.Market.Requests
{
    public class CreateRequest : IRequest<bool>
    {
        public CreateRequest(Core.Models.Market market)
        {
            this.Market = market;
        }

        public Core.Models.Market Market { get; }
    }
}
