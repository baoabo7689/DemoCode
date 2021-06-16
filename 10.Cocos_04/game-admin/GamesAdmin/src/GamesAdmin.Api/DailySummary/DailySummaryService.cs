using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GamesAdmin.Core.Models.DailySummary;
using GamesAdmin.Database;

namespace GamesAdmin.Api.DailySummarize
{
    public interface IDailySummaryService
    {
        Task<IEnumerable<DailySummaryResult>> Get(DateTime summarizeDate, bool isCash);
    }

    public class DailySummaryService : IDailySummaryService
    {
        private readonly IDailySummaryRepository repository;

        public DailySummaryService(IDailySummaryRepository repository)
        {
            this.repository = repository;
        }

        public async Task<IEnumerable<DailySummaryResult>> Get(DateTime summarizeDate, bool isCash)
        {
            var result = (await repository.FilterByAsync(x => x.Time.Equals(DateTime.SpecifyKind(summarizeDate, DateTimeKind.Utc)) && x.IsCash == isCash)).ToList();

            return result
                .GroupBy(x => x.Currency)
                .Select(g => new DailySummaryResult(
                    g.Key,
                    decimal.Round(g.Sum(i => i.Stake), 2),
                    decimal.Round(g.Sum(i => i.Payout), 2),
                    g.Sum(i => i.Tickets)));
        }
    }
}
