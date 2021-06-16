using System.Collections.Generic;
using GamesAdmin.Core.Models.BolaTangkas;
using MediatR;

namespace GamesAdmin.Api.ResultsConfig.Request
{
    public class GetAllRequest : IRequest<IEnumerable<BolaTangKasResultsConfigModel>>
    {
        public GetAllRequest(string curency)
        {
            this.Curency = curency;
        }

        public string Curency { get; set; }
    }
}