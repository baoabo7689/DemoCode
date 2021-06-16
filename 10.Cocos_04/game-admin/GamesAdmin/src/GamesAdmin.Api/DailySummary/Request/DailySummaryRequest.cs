using System;
using System.Collections.Generic;
using GamesAdmin.Core.Models.DailySummary;
using MediatR;

namespace GamesAdmin.Api.DailySummary.Request
{
    public class DailySummaryRequest : IRequest<IEnumerable<DailySummaryResult>>
    {
        public DailySummaryRequest(DateTime summarizedDate, bool isCash)
        {
            SummarizedDate = summarizedDate;
            IsCash = isCash;
        }
        
        public DateTime SummarizedDate { get; }

        public bool IsCash { get; }
    }
}
