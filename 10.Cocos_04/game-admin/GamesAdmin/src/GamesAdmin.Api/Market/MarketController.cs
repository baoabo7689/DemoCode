using GamesAdmin.Api._Shared;
using GamesAdmin.Api.Market.Requests;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GamesAdmin.Api.Market
{
    [Route("api/market")]
    public class MarketController : BaseAuthorizeController
    {
        private readonly IMediator mediator;

        public MarketController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpGet]
        [ProducesResponseType(typeof(IList<Core.Models.Market>), StatusCodes.Status200OK)]
        public async Task<IActionResult> Get()
        {
            var gameConfigs = (await mediator.Send(new GetAllRequest())).ToList();

            return Ok(gameConfigs);
        }

        [HttpPost]
        public async Task<bool> Create(Core.Models.Market market)
        {
            if (string.IsNullOrWhiteSpace(market.Name))
            {
                return false;
            }

            return await mediator.Send(new CreateRequest(market));
        }

        [HttpGet("{name}")]
        public Task<Core.Models.Market> GetByName(string name)
            => mediator.Send(new GetByNameRequest(name));

        [HttpPut]
        public Task<bool> Update(Core.Models.Market market)
            => mediator.Send(new UpdateRequest(market));

        [HttpPut("{name}/update_status")]
        public Task<bool> UpdateStatus(string name, bool enabled)
           => mediator.Send(new UpdateStatusRequest(name, enabled));

        [HttpPost("UpdateRate")]
        public Task<bool> UpdateRate(Core.Models.Market market)
           => mediator.Send(new UpdateRateRequest(market));
    }
}
