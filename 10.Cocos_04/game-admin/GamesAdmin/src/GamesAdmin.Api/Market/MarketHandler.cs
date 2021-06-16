using GamesAdmin.Api.Market.Requests;
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace GamesAdmin.Api.Market
{
    public class MarketHandler : 
        IRequestHandler<GetAllRequest, IEnumerable<Core.Models.Market>>, 
        IRequestHandler<CreateRequest, bool>,
        IRequestHandler<GetByNameRequest, Core.Models.Market>,
        IRequestHandler<UpdateRequest, bool>,
        IRequestHandler<UpdateStatusRequest, bool>,
        IRequestHandler<UpdateRateRequest, bool>
    {
        private readonly IMarketService marketService;

        public MarketHandler(IMarketService marketService)
        {
            this.marketService = marketService;
        }

        public Task<IEnumerable<Core.Models.Market>> Handle(GetAllRequest request, CancellationToken cancellationToken) => this.marketService.Get();

        public Task<bool> Handle(CreateRequest request, CancellationToken cancellationToken) => this.marketService.Create(request.Market);

        public Task<Core.Models.Market> Handle(GetByNameRequest request, CancellationToken cancellationToken) => this.marketService.GetByName(request.Name);

        public Task<bool> Handle(UpdateRequest request, CancellationToken cancellationToken) => this.marketService.Update(request.Market);

        public Task<bool> Handle(UpdateStatusRequest request, CancellationToken cancellationToken) => this.marketService.UpdateStatus(request.Name, request.Enabled);

        public Task<bool> Handle(UpdateRateRequest request, CancellationToken cancellationToken)
        {
            return this.marketService.UpdateRate(request.Market);
        }
    }
}
