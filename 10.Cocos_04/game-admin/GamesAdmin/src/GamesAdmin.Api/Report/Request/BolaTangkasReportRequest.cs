using GamesAdmin.Core.Models;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GamesAdmin.Api.Report.Request
{
    public class BolaTangkasReportRequest : IRequest<BolaTangkasBetReport>
    {
        public BolaTangkasReportRequest(long roundId, string nickname)
        {
            RoundId = roundId;
            Nickname = nickname;
        }

        public long RoundId { get; }

        public string Nickname { get; }
    }
}
