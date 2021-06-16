using GamesAdmin.Site.Features.DailySummary.ViewModels;
using MediatR;
using System;

namespace GamesAdmin.Site.Features.DailySummary.Requests
{
    public class GetReportRequest : IRequest<ResultViewModel>
    {
        public GetReportRequest(DateTime summarizedDate, bool isCash)
        {
            SummarizedDate = summarizedDate;
            IsCash = isCash;
        }

        public DateTime SummarizedDate { get; }

        public bool IsCash { get; }
    }
}
