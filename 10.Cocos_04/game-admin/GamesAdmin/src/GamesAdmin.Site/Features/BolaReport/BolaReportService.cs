using GamesAdmin.Core.Models.BolaTangkas;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace GamesAdmin.Site.Features.BolaReport
{
    public interface IBolaReportService
    {
        Task<IEnumerable<BolaTangkasWinLossReport>> GetReport(string currency, int stake, int status);
        Task<IEnumerable<CombinationConfig>> GetConfig(int combinationId);
        Task<bool> Edit(bool isEnabled, int combinationId);
    }

    public class BolaReportService : IBolaReportService
    {
        private readonly IBolaReportApi reportApi;

        public BolaReportService(IBolaReportApi reportApi)
        {
            this.reportApi = reportApi;
        }

        public async Task<bool> Edit(bool isEnabled, int combinationId)
        {   
            var result = await reportApi.Edit(isEnabled, combinationId);

            return result;
        }

        public async Task<IEnumerable<CombinationConfig>> GetConfig(int combinationId)
        {
            var result = await reportApi.BolaTangkasStakeConfig(combinationId);

            return result;
        }

        public async Task<IEnumerable<BolaTangkasWinLossReport>> GetReport(string currency, int stake, int status)
        { 
            var result = await reportApi.GetReport(currency, stake, status);

            return result;
        }
    }
}
