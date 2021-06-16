using GamesAdmin.Site.Features.Market.ViewModels;
using MediatR;

namespace GamesAdmin.Site.Features.Market.Requests
{
    public class GetAllRequest: IRequest<MarketViewModel>
    {
    }
}
