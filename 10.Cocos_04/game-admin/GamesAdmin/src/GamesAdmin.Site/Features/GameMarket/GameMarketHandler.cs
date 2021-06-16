using GamesAdmin.Core.Models;
using GamesAdmin.Site.Features.GameMarket.Requests;
using GamesAdmin.Site.Features.GameMarket.ViewModels;
using GamesAdmin.Site.Features.GameSettings.ViewModels;
using MediatR;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace GamesAdmin.Site.Features.GameMarket
{
    public class GameMarketHandler
        : IRequestHandler<EditRequest, ViewModels.EditViewModel>
        , IRequestHandler<UpdateRequest, bool>
    {
        private readonly IGameMarketService service;

        public GameMarketHandler(IGameMarketService service) {
            this.service = service;
        }

        public async Task<ViewModels.EditViewModel> Handle(EditRequest request, CancellationToken cancellationToken)
        {
            var gameSetting = await this.service.Get(request.Name);
            gameSetting.DisabledShowBot = StatusItemViewModel.gameDisabledShowBot.Contains(request.Name);
            gameSetting.EnabledDelayStartTime = StatusItemViewModel.enabledDelayStartTime.Contains(request.Name);
            gameSetting.GameMarkets = gameSetting.GameMarkets.OrderBy(m => m.MarketName).ToList();
            var viewModel = new ViewModels.EditViewModel
            { 
                GameSetting = gameSetting
            };

            return viewModel;
        }

        public async Task<bool> Handle(UpdateRequest request, CancellationToken cancellationToken)
        {
            return await this.service.Update(request.GameSetting.GameSetting);
        }
    }
}
