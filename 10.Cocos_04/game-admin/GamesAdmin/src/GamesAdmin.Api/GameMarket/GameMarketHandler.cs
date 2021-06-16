using GamesAdmin.Api.GameMarket.Requests;
using GamesAdmin.Core.Models;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace GamesAdmin.Api.GameMarket
{
    public class GameMarketHandler
        : IRequestHandler<GetByNameRequest, GameSettingModel>
        , IRequestHandler<UpdateRequest, bool>
    {

        private readonly IGameMarketService gameService;

        public GameMarketHandler(IGameMarketService gamesService)
        {
            this.gameService = gamesService;
        }

        public async Task<GameSettingModel> Handle(GetByNameRequest request, CancellationToken cancellationToken)
        {
            return await this.gameService.Get(request.Name);
        }

        public async Task<bool> Handle(UpdateRequest request, CancellationToken cancellationToken)
        {
            return await this.gameService.Update(request.GameSetting);
        }
    }
}
