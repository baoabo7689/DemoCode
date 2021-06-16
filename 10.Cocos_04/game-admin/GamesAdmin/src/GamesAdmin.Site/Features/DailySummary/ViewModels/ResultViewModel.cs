using GamesAdmin.Core.Models.DailySummary;
using System.Collections.Generic;

namespace GamesAdmin.Site.Features.DailySummary.ViewModels
{
    public class ResultViewModel
    {
        public IEnumerable<DailySummaryResult> Records { get; set; }
    }
}
