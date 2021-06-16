using GamesAdmin.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GamesAdmin.Site.Features.GameMarket
{
    public interface IGameMarketService
    {
        Task<GameSettingModel> Get(string name);
        Task<bool> Update(GameSettingModel gameSetting);
    }

    public class GameMarketService : IGameMarketService
    {
        private readonly IGameMarketApi gameApi;

        public GameMarketService(IGameMarketApi gameApi) {
            this.gameApi = gameApi;
        }

        public async Task<GameSettingModel> Get(string name)
        {
            return await this.gameApi.Get(name);
        }

        public async Task<bool> Update(GameSettingModel gameSetting)
        {
            return await this.gameApi.Update(gameSetting);
        }
    }
}
