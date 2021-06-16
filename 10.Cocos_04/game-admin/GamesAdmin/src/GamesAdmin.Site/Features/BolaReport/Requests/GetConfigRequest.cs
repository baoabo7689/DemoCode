using GamesAdmin.Site.Features.BolaReport.ViewModels;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GamesAdmin.Site.Features.BolaReport.Requests
{
    public class GetConfigRequest : IRequest<ConfigViewModel>
    {
        public GetConfigRequest(string currency, int stake, int tableIndex)
        {
            Currency = currency;
            Stake = stake;
            TableIndex = tableIndex;
        }

        public string Currency { get; }
        public int Stake { get; }
        public int TableIndex { get; }
    }
}
