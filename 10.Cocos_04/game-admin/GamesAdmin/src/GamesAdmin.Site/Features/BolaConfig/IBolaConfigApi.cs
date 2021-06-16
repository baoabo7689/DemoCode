using GamesAdmin.Core.Models.BolaTangkas;
using GamesAdmin.Site.Features._Shared;
using Refit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GamesAdmin.Site.Features.BolaConfig
{
    public interface IBolaConfigApi : IBaseAuthorizationApi
    {
        [Post("/result_config/create")]
        Task<bool> LoadNew(IEnumerable<BolaTangKasResultsConfigModel> configs);

        [Get("/result_config/getall/{curency}")]
        Task<List<BolaTangKasResultsConfigModel>> GetAll(string curency);

        [Get("/result_config/{curency}")]
        Task<BolaTangKasResultsConfigModel> Get(string curency);

        [Put("/result_config/curency_config")]
        Task<bool> UpdateCurencyConfig(BolaTangKasResultsConfigModel model);

        [Put("/result_config/stake_config")]
        Task<bool> UpdateStakeConfig(string curency, StakeConfig config);
    }
}
