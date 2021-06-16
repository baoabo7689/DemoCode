using GamesAdmin.Site.Features.BolaReport.ViewModels;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GamesAdmin.Site.Features.BolaReport.Requests
{
    public class GetReportRequest : IRequest<ReportResultViewModel>
    {
        public GetReportRequest(string currency, int stake, int status)
        {
            Currency = currency;
            Stake = stake;
            Status = status;
        }

        public string Currency { get; set; }

        public int Stake { get; set; }

        public int Status { get; set; }
    }
}
