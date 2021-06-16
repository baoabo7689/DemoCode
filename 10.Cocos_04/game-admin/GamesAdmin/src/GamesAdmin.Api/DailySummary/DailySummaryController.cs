using System;
using System.Threading.Tasks;
using GamesAdmin.Api._Shared;
using GamesAdmin.Api.DailySummary.Request;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace GamesAdmin.Api.DailySummarize
{
    [Route("api/daily_summary")]
    public class DailySummaryController : BaseAuthorizeController
    {
        private IMediator mediator;

        public DailySummaryController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpGet("get_report")]
        public async Task<IActionResult> Index(DateTime summarizedDate, bool isCash)
        {
            var result = await mediator.Send(new DailySummaryRequest(summarizedDate, isCash));
            return Ok(result);
        }
    }
}
