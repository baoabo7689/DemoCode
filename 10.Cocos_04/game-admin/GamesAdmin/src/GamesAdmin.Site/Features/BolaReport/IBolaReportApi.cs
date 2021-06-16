using System.Collections.Generic;
using System.Threading.Tasks;
using GamesAdmin.Core.Models.BolaTangkas;
using GamesAdmin.Site.Features._Shared;
using Refit;

namespace GamesAdmin.Site.Features.BolaReport
{
    public interface IBolaReportApi : IBaseAuthorizationApi
    {
        [Get("/report/bola_tangkas_WL/currency/{currency}/stake/{stake}/status/{status}")]
        Task<IEnumerable<BolaTangkasWinLossReport>> GetReport(string currency, int stake, int status);

        [Get("/report/bola_tangkas/stake_config/combinationId/{combinationId}")]
        Task<IEnumerable<CombinationConfig>> BolaTangkasStakeConfig(int combinationId);

        [Put("/report/bola_tangkas/combination_status/update")]
        Task<bool> Edit(bool isEnabled, int combinationId);
    }
}