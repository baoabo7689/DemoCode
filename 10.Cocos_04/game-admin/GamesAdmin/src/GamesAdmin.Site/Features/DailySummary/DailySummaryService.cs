using GamesAdmin.Core.Models.DailySummary;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace GamesAdmin.Site.Features.DailySummary
{
    public interface IDailySummaryService
    {
        Task<IEnumerable<DailySummaryResult>> GetAll(DateTime summarizedDate, bool isCash);
    }

    public class DailySummaryService : IDailySummaryService
    {
        private readonly IDailySummaryApi dailySummaryApi;

        public DailySummaryService(IDailySummaryApi dailySummaryApi)
        {
            this.dailySummaryApi = dailySummaryApi;
        }

        public async Task<IEnumerable<DailySummaryResult>> GetAll(DateTime summarizedDate, bool isCash)
        {
            return await this.dailySummaryApi.GetAll(summarizedDate, isCash);
        }
    }
}
