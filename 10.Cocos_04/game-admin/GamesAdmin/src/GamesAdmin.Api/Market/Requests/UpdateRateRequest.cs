using MediatR;

namespace GamesAdmin.Api.Market.Requests
{
    public class UpdateRateRequest : IRequest<bool>
    {
        public Core.Models.Market Market { get; set; }

        public UpdateRateRequest(Core.Models.Market market)
        {
            this.Market = market;
        }
    }
}
