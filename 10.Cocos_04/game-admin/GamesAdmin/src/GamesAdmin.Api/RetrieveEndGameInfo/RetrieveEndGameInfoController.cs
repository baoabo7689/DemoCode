using GamesAdmin.Api._Shared;
using GamesAdmin.Api.RetrieveEndGameInfo.Requests;
using GamesAdmin.Core.Enumeration;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace GamesAdmin.Api.RetrieveEndGameInfo
{
    [Route("api/retrieve_end_game")]
    public class RetrieveEndGameInfoController : BaseAuthorizeController
    {
        private readonly IMediator mediator;

        public RetrieveEndGameInfoController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpGet("get_site_id")]
        public async Task<IActionResult> GetSiteId(int memberId, long gameRoundId, GameId gameType)
        {
            var config = await mediator.Send(new GetSiteIdRequest(memberId, gameRoundId, gameType));

            return Ok(config);
        }
    }
}
