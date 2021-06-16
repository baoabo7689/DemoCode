using GamesAdmin.Core.Models.BolaTangkas;
using MediatR;

namespace GamesAdmin.Api.ResultsConfig.Request
{
    public class GetByCurencyRequest : IRequest<BolaTangKasResultsConfigModel>
    {
        public GetByCurencyRequest(string curency)
        {
            this.Curency = curency;
        }

        public string Curency { get; set; }
    }
}