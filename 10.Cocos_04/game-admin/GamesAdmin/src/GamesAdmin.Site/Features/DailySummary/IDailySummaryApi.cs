using GamesAdmin.Core.Models.DailySummary;
using GamesAdmin.Site.Features._Shared;
using Refit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GamesAdmin.Site.Features.DailySummary
{
    public interface IDailySummaryApi : IBaseAuthorizationApi
    {
        [Get("/daily_summary/get_report")]
        Task<IEnumerable<DailySummaryResult>> GetAll(DateTime summarizedDate, bool isCash);
    }
}
