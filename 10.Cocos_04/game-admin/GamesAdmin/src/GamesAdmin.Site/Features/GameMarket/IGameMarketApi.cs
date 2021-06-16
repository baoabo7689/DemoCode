using GamesAdmin.Core.Models;
using GamesAdmin.Site.Features._Shared;
using Refit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GamesAdmin.Site.Features.GameMarket
{
    public interface IGameMarketApi : IBaseAuthorizationApi
    {
        [Get("/gamemarket/{name}")]
        Task<GameSettingModel> Get(string name);
        
        [Post("/gamemarket")]
        Task<bool> Update(GameSettingModel gameSetting);
    }
}
