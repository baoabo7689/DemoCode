using GamesAdmin.Site._Shared.Middlewares;
using GamesAdmin.Site.Features.BolaConfig.Requests;
using GamesAdmin.Site.Features.BolaConfig.ViewModels;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sentry;
using System;
using System.Threading.Tasks;

namespace GamesAdmin.Site.Features.BolaConfig
{
    [AuthorizeWithLog(Policy: "admin")]
    public class BolaConfigController : Controller
    {
        private readonly IMediator mediator;
        private readonly ISentryClient sentryClient;

        public BolaConfigController(IMediator mediator, ISentryClient sentryClient)
        {
            this.mediator = mediator;
            this.sentryClient = sentryClient;
        }

        [HttpGet]
        public IActionResult Index()
        {
            return View(new ReportViewModel());
        }

        [HttpGet]
        public async Task<IActionResult> GetReport(string currency)
        {
            return PartialView("_BolaRecords", await mediator.Send(new GetReportRequest(currency)));
        }

        [HttpGet]
        public async Task<IActionResult> Edit(string currency)
        {
            var viewModel = await mediator.Send(new GetEditRequest(currency));

            return View("~/Features/BolaConfig/Views/Edit.cshtml", viewModel);
        }

        [HttpPost]
        public async Task<IActionResult> Edit([Bind] EditViewModel model)
        {
            try
            {
                await mediator.Send(new EditRequest(model));

                return Json(true);
            }
            catch (Exception ex)
            {
                sentryClient.CaptureException(ex);
            }

            return Json(false);
        }

        [HttpGet]
        public async Task<IActionResult> EditAmount(string currency, int amount)
        {
            var viewModel = await mediator.Send(new GetEditAmountRequest(currency, amount));

            return View("~/Features/BolaConfig/Views/EditAmount.cshtml", viewModel);
        }

        [HttpPost]
        public async Task<IActionResult> EditAmount([Bind] EditAmountViewModel model)
        {
            if (!ModelState.IsValid) {
                return Json(false);
            }

            try
            {
                await mediator.Send(new EditAmountRequest(model));

                return Json(true);
            }
            catch (Exception ex)
            {
                sentryClient.CaptureException(ex);
            }

            return Json(false);
        }

        [HttpPost]
        public async Task<IActionResult> LoadNew()
        {
            try
            {
                await mediator.Send(new LoadNewRequest());

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
