using GamesAdmin.Api._Shared;
using GamesAdmin.Api.ChipConfig.Requests;
using GamesAdmin.Core.Models.Chip;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;

namespace GamesAdmin.Api.ChipConfig
{
    [Route("api/chip_config")]
    public class ChipConfigController : BaseAuthorizeController
    {
        private readonly IMediator mediator;

        public ChipConfigController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpGet("get_all")]
        public async Task<IActionResult> GetAll()
        {
            var configs = (await mediator.Send(new GetAllRequest())).ToList();

            return Ok(configs);
        }

        [HttpGet("get_by_name")]
        public async Task<IActionResult> Get(string name = "")
        {
            var config = await mediator.Send(new GetByNameRequest(name));

            return Ok(config);
        }

        [HttpPost("upsert")]
        public async Task<bool> Upsert(ChipModel model)
        {
            return await mediator.Send(new UpsertRequest(model));
        }
    }
}
