using GamesAdmin.Site._Shared.Configurations;
using GamesAdmin.Site._Shared.Middlewares;
using GamesAdmin.Site.Features.BolaReport.Requests;
using GamesAdmin.Site.Features.BolaReport.ViewModels;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sentry;
using System;
using System.Threading.Tasks;

namespace GamesAdmin.Site.Features.BolaReport
{
    [AuthorizeWithLog(Policy: "admin")]
    public class BolaReportController : Controller
    {
        private readonly IMediator mediator;
        private readonly IAppSettings appSettings;
        private readonly ISentryClient sentryClient;

        public BolaReportController(IMediator mediator, IAppSettings appSettings, ISentryClient sentryClient)
        {
            this.mediator = mediator;
            this.appSettings = appSettings;
            this.sentryClient = sentryClient;
        }

        [HttpGet]
        public IActionResult Index()
        {
            var model = new BolaReportViewModel(appSettings);
            return View(model);
        }

        [HttpGet]
        public async Task<IActionResult> GetReport(string currency, int stake, int status)
        {
            return PartialView("_BolaRecords", await mediator.Send(new GetReportRequest(currency, stake, status)));
        }

        [HttpGet]
        public async Task<IActionResult> Config(string currency, int stake, int tableIndex)
        {   
            var model = await mediator.Send(new GetConfigRequest(currency, stake, tableIndex));

            return View("~/Features/BolaReport/Views/ConfigModal.cshtml", model);
        }

        [HttpPost]
        public async Task<IActionResult> EnableDisable(bool enabled, int tableIndex)
        {
            try
            {
                await mediator.Send(new EditRequest(enabled, tableIndex));

                return Json(true);
            }
            catch (Exception ex)
            {
                sentryClient.CaptureException(ex);
            }

            return Json(false);
        }        
    }
}
