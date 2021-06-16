using GamesAdmin.Site.Features.BolaConfig.ViewModels;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GamesAdmin.Site.Features.BolaConfig.Requests
{
    public class GetReportRequest : IRequest<ReportResultViewModel>
    {
        public GetReportRequest(string currency)
        {
            Currency = currency;            
        }

        public string Currency { get; set; }        
    }
}
