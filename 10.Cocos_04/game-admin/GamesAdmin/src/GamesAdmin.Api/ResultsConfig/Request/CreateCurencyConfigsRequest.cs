using System.Collections.Generic;
using GamesAdmin.Core.Models.BolaTangkas;
using MediatR;

namespace GamesAdmin.Api.ResultsConfig.Request
{
    public class CreateCurencyConfigsRequest : IRequest<bool>
    {
        public CreateCurencyConfigsRequest(List<BolaTangKasResultsConfigModel> configs)
        {
            this.Configs = configs;
        }

        public List<BolaTangKasResultsConfigModel> Configs { get; set; }
    }
}