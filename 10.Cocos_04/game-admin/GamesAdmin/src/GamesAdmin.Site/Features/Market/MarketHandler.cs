using AutoMapper;
using GamesAdmin.Site.Features.ChipConfig;
using GamesAdmin.Site.Features.Market.Requests;
using GamesAdmin.Site.Features.Market.ViewModels;
using MediatR;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace GamesAdmin.Site.Features.Market
{
    public class MarketHandler :
        IRequestHandler<AddRequest, AddViewModel>,
        IRequestHandler<CreateRequest, bool>,
        IRequestHandler<GetAllRequest, MarketViewModel>,
        IRequestHandler<EditRequest, EditViewModel>,
        IRequestHandler<UpdateRequest, bool>,
        IRequestHandler<UpdateStatusRequest, bool>,
        IRequestHandler<EditRateRequest, EditRateViewModel>,
        IRequestHandler<EditRateUpdateRequest, bool>        
    {
        private readonly IMapper mapper;
        private readonly IMarketService marketService;
        private readonly IChipConfigService chipService;

        public MarketHandler(
            IMapper mapper,
            IMarketService marketService,
            IChipConfigService chipService)
        {
            this.mapper = mapper;
            this.marketService = marketService;
            this.chipService = chipService;
        }

        public async Task<AddViewModel> Handle(AddRequest request, CancellationToken cancellationToken)
        {
            var viewModel = new AddViewModel
            {
                Enabled = true,
                Currencies = "UUS; US$",
                ChipOptions = await GetChipOptions()
            };

            return viewModel;

        }

        public Task<bool> Handle(CreateRequest request, CancellationToken cancellationToken)
        {
            return this.marketService.Add(new Core.Models.Market { 
                Id = request.Market.Id,
                Name = request.Market.Name,
                Enabled = request.Market.Enabled,
                Cash = request.Market.Cash,
                Currencies = request.Market.Currencies,
                DefaultChipId = request.Market.DefaultChipId
            });          
        }

        public async Task<MarketViewModel> Handle(GetAllRequest request, CancellationToken cancellationToken)
        {
            var markets = await this.marketService.GetAll();

            if (markets?.Any() == true)
            {
                return new MarketViewModel(markets);
            }

            return new MarketViewModel(null);
        }

        public async Task<EditViewModel> Handle(EditRequest request, CancellationToken cancellationToken)
        {
            var marketEntity = await marketService.GetByName(request.Name);

            if (marketEntity != null)
            {
                var viewModel = mapper.Map<EditViewModel>(marketEntity);
                viewModel.ChipOptions = await GetChipOptions();

                return viewModel;
            }

            return new EditViewModel { 
                ChipOptions = await GetChipOptions()
            };
        }

        public Task<bool> Handle(UpdateRequest request, CancellationToken cancellationToken)
        {
            return this.marketService.Update(new Core.Models.Market{ 
                Id = request.Market.Id,
                Name = request.Market.Name,
                Enabled = request.Market.Enabled,
                Currencies = request.Market.Currencies,
                DefaultChipId = request.Market.DefaultChipId,
                Cash = request.Market.Cash
            });            
        }

        public Task<bool> Handle(UpdateStatusRequest request, CancellationToken cancellationToken)
        {
            return this.marketService.UpdateStatus(request.Name, request.Enabled);
        }

        public async Task<EditRateViewModel> Handle(EditRateRequest request, CancellationToken cancellationToken)
        {
            var marketEntity = await marketService.GetByName(request.Name);

            if (marketEntity != null)
            {
                return new EditRateViewModel
                {
                    Id = marketEntity.Id,
                    Name = marketEntity.Name,
                    Rate = marketEntity.Rate,
                    IsBase = marketEntity.IsBase
                };
            }

            return new EditRateViewModel();
        }

        public Task<bool> Handle(EditRateUpdateRequest request, CancellationToken cancellationToken)
        {
            return this.marketService.UpdateRate(new Core.Models.Market
            {
                Id = request.Model.Id,
                Name = request.Model.Name,
                Rate = request.Model.Rate,
                IsBase = request.Model.IsBase
            });
        }

        private async Task<List<SelectListItem>> GetChipOptions()
        {
            var allChips = await this.chipService.GetAll();
            return allChips.Select(c => new SelectListItem { Text = c.Label, Value = c.Id }).ToList();
        }
    }
}
