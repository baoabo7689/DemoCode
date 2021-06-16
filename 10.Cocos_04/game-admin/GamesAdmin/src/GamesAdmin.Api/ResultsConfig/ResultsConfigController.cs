using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GamesAdmin.Api._Shared;
using GamesAdmin.Api.ResultsConfig.Request;
using GamesAdmin.Core.Models.BolaTangkas;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Sentry;

namespace GamesAdmin.Api.ResultsConfig
{
    [Route("api/result_config")]
    public class ResultsConfigController : BaseAuthorizeController
    {
        private readonly IMediator mediator;

        public ResultsConfigController(IMediator mediator, ISentryClient sentryClient)
        {
            this.mediator = mediator;
        }

        [HttpGet("getall/{curency?}")]
        [ProducesResponseType(typeof(List<BolaTangKasResultsConfigModel>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAll (string curency = "")
        {
            var configs = (await mediator.Send(new GetAllRequest(curency))).ToList();

            return Ok(configs);
        }

        [HttpPost("create")]
        public async Task<bool> Create(List<BolaTangKasResultsConfigModel> configs)
        {
            return await mediator.Send(new CreateCurencyConfigsRequest(configs));
        }

        [HttpGet("{curency}")]
        public async Task<IActionResult> Get(string curency)
        {
            var config = await mediator.Send(new GetByCurencyRequest(curency));

            return Ok(config);
        }

        [HttpPut("curency_config")]
        public async Task<bool> UpdateCurencyConfig(BolaTangKasResultsConfigModel model)
        {
            if(string.IsNullOrEmpty(model.Currency))
            {
                return false;
            }

            return await mediator.Send(new UpdateCurencyRequest(model));
        }
        
        [HttpPut("stake_config")]
        public async Task<bool> UpdateStakeConfig(string curency, StakeConfig config)
        {
            if (string.IsNullOrEmpty(curency))
            {
                return false;
            }

            return await mediator.Send(new UpdateStakeConfigRequest(curency, config));
        }

    }
}