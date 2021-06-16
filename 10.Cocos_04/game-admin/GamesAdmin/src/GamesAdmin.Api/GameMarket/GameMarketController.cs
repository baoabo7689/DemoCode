using GamesAdmin.Api._Shared;
using GamesAdmin.Api.GameMarket.Requests;
using GamesAdmin.Core.Models;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace GamesAdmin.Api.GameMarket
{
    [Route("api/gamemarket")]
    public class GameMarketController : BaseAuthorizeController
    {
        private readonly IMediator mediator;

        public GameMarketController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpGet("{name}")]
        [ProducesResponseType(typeof(GameSettingModel), StatusCodes.Status200OK)]
        public async Task<IActionResult> Get(string name)
        {
            var gameSetting = await mediator.Send(new GetByNameRequest(name));

            return Ok(gameSetting);
        }

        [HttpPost]
        public async Task<bool> Update(GameSettingModel gameSetting)
        {
            if (string.IsNullOrWhiteSpace(gameSetting.GameName))
            {
                return false;
            }

            return await mediator.Send(new UpdateRequest(gameSetting));
        }
    }
}
