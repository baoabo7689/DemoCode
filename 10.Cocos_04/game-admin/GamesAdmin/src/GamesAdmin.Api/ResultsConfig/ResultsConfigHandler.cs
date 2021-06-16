using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using GamesAdmin.Api.ResultsConfig.Request;
using GamesAdmin.Core.Models.BolaTangkas;
using MediatR;

namespace GamesAdmin.Api.ResultsConfig
{
    public class ResultsConfigHandler
        : IRequestHandler<GetAllRequest, IEnumerable<BolaTangKasResultsConfigModel>>,
        IRequestHandler<GetByCurencyRequest, BolaTangKasResultsConfigModel>,
        IRequestHandler<UpdateCurencyRequest, bool>,
        IRequestHandler<UpdateStakeConfigRequest, bool>,
        IRequestHandler<CreateCurencyConfigsRequest, bool>
    {
        private readonly IResultsConfigService resultsConfigService;

        public ResultsConfigHandler(IResultsConfigService resultsConfigService)
        {
            this.resultsConfigService = resultsConfigService;
        }

        public Task<IEnumerable<BolaTangKasResultsConfigModel>> Handle(GetAllRequest request, CancellationToken cancellationToken)
            => resultsConfigService.GetAll(request.Curency);

        public Task<bool> Handle(UpdateCurencyRequest request, CancellationToken cancellationToken)
            => resultsConfigService.UpdateCurencyConfig(request.Model);

        public Task<BolaTangKasResultsConfigModel> Handle(GetByCurencyRequest request, CancellationToken cancellationToken)
            => resultsConfigService.GetByCurency(request.Curency);

        public Task<bool> Handle(UpdateStakeConfigRequest request, CancellationToken cancellationToken)
            => resultsConfigService.UpdateStakeConfig(request.Curency, request.Stake);

        public Task<bool> Handle(CreateCurencyConfigsRequest request, CancellationToken cancellationToken)
            => resultsConfigService.CreateConfigs(request.Configs);


    }
}