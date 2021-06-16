using System.Collections.Generic;
using GamesAdmin.Core.Models.BolaTangkas;
using MediatR;

namespace GamesAdmin.Api.Report.Request
{
    public class BolaTangkasStakeConfigRequest : IRequest<IEnumerable<CombinationConfig>>
    {
        public BolaTangkasStakeConfigRequest(int combinationIndex)
        {
            CombinationIndex = combinationIndex;
        }

        public int CombinationIndex { get; set; }
    }
}