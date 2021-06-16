using GamesAdmin.Site._Shared.Middlewares;
using GamesAdmin.Site.Features.DailySummary.Requests;
using GamesAdmin.Site.Features.DailySummary.ViewModels;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace GamesAdmin.Site.Features.DailySummary
{
    [AuthorizeWithLog(Policy: "admin")]
    public class DailySummaryController : Controller
    {
        private readonly IMediator mediator;

        public DailySummaryController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpGet]
        public IActionResult Index()
        {
            var model = new QueryViewModel();

            return View(model);
        }

        [HttpGet]
        public async Task<IActionResult> GetReport(DateTime summarizedDate, bool isCash)
        {
            return PartialView("_Records", await mediator.Send(new GetReportRequest(summarizedDate, isCash)));
        }
    }
}
