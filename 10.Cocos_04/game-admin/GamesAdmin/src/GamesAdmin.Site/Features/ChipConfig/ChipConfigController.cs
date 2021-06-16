using GamesAdmin.Site._Shared.Middlewares;
using GamesAdmin.Site.Features.ChipConfig.Requests;
using GamesAdmin.Site.Features.ChipConfig.ViewModels;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Sentry;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GamesAdmin.Site.Features.ChipConfig
{
    [Authorize]
    public class ChipConfigController : Controller
    {
        private readonly IMediator mediator;
        private readonly ISentryClient sentryClient;

        public ChipConfigController(IMediator mediator, ISentryClient sentryClient)
        {
            this.mediator = mediator;
            this.sentryClient = sentryClient;
        }

        [HttpGet]
        public async Task<IActionResult> Index()
        {
            var viewModel = await mediator.Send(new GetReportRequest());
            return View(viewModel);
        }

        [HttpGet]
        public async Task<IActionResult> Edit(string name)
        {
            var viewModel = await mediator.Send(new GetEditRequest(name));

            return View("~/Features/ChipConfig/Views/Edit.cshtml", viewModel);
        }

        [AuthorizeWithLog(Policy: "admin")]
        [HttpPost]
        public async Task<IActionResult> Edit([Bind] EditViewModel model)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return Json(new { success = false, message = allErrors.FirstOrDefault().ErrorMessage });
            }

            try
            {
                await mediator.Send(new EditRequest(model));

                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                sentryClient.CaptureException(ex);
            }

            return Json(new { success = true });
        }
    }
}
