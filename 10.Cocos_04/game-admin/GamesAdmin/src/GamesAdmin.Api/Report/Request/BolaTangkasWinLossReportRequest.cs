using System.Collections.Generic;
using GamesAdmin.Core.Models.BolaTangkas;
using MediatR;
using Microsoft.AspNetCore.Diagnostics;

namespace GamesAdmin.Api.Report.Request
{
    public class BolaTangkasWinLossReportRequest : IRequest<IEnumerable<BolaTangkasWinLossReport>>
    {
        public BolaTangkasWinLossReportRequest(string currency, int stake, int status)
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