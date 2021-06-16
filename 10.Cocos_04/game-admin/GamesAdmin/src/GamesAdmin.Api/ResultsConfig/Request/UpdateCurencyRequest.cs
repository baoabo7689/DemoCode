using GamesAdmin.Core.Models.BolaTangkas;
using MediatR;

namespace GamesAdmin.Api.ResultsConfig.Request
{
    public class UpdateCurencyRequest : IRequest<bool>
    {
        public UpdateCurencyRequest(BolaTangKasResultsConfigModel model)
        {
            this.Model = model;
        }

        public BolaTangKasResultsConfigModel Model { get; set; }
    }
}