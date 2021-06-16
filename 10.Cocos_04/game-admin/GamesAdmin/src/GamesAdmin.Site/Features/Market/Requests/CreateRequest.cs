using MediatR;

namespace GamesAdmin.Site.Features.Market.Requests
{
    public class CreateRequest : IRequest<bool>
    {
        public CreateRequest(Core.Models.Market market)
        {
            Market = market;
        }

        public Core.Models.Market Market { get; }
    }
}
