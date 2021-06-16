using GamesAdmin.Site._Shared.Middlewares;
using GamesAdmin.Site.Features.GameMarket.Requests;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Sentry;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GamesAdmin.Site.Features.GameMarket
{
    [Authorize]
    public class GameMarketController : Controller
    {
        private readonly IMediator mediator;
        private readonly ISentryClient sentryClient;

        public GameMarketController(IMediator mediator, ISentryClient sentryClient)
        {
            this.mediator = mediator;
            this.sentryClient = sentryClient;
        }

        [HttpGet]
        [Route("gamemarket/{name}")]
        public async Task<IActionResult> Edit(string name)
        {
            var viewModel = await mediator.Send(new EditRequest(name));

            return View("~/Features/GameMarket/Views/Edit.cshtml", viewModel);
        }

        [AuthorizeWithLog("admin")]
        [HttpPost]
        [Route("gamemarket")]
        public async Task<IActionResult> Update([Bind] ViewModels.EditViewModel editViewModel)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return Json(new {success = false, message = allErrors.FirstOrDefault().ErrorMessage });
            }

            try
            {
                await mediator.Send(new UpdateRequest(editViewModel));
                return Json(new { success = true});
            }
            catch (Exception ex)
            {
                sentryClient.CaptureException(ex);
            }

            return Json(new { success = true });
        }
    }
}
