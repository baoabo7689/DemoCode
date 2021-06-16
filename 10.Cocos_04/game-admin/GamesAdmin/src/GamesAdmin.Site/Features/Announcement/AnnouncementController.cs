using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GamesAdmin.Core.Models.Announcement;
using GamesAdmin.Site._Shared.Configurations;
using GamesAdmin.Site._Shared.Middlewares;
using GamesAdmin.Site.Features.Announcement.Requests;
using GamesAdmin.Site.Features.Announcement.ViewModels;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.Rendering;
using Sentry;

namespace GamesAdmin.Site.Features.Announcement
{
    [Authorize]
    public class AnnouncementController : Controller
    {
        private readonly IMediator mediator;
        private readonly IAppSettings appSettings;
        private readonly ISentryClient sentryClient;

        public AnnouncementController(IMediator mediator, IAppSettings appSettings, ISentryClient sentryClient)
        {
            this.mediator = mediator;
            this.appSettings = appSettings;
            this.sentryClient = sentryClient;
        }

        [HttpGet]
        public async Task<IActionResult> Index()
        {
            var model = new AnnouncementViewModel();

            var markets = await mediator.Send(new Market.Requests.GetAllRequest());
            var marketSelectList = markets.Markets.Select(market => new SelectListItem(market.Name, market.Id)).ToList();

            marketSelectList.Insert(0, new SelectListItem("All", string.Empty));

            model.MarketOptions = marketSelectList;

            return View(model);
        }

        [HttpGet]
        public async Task<IActionResult> GetReport(GetReportRequest model)
        {
            return PartialView("_Records", await mediator.Send(model));
        }

        [HttpGet]
        public async Task<IActionResult> Edit(string id)
        {
            try
            {
                var viewModel = id != null ? await mediator.Send(new GetEditRequest(id)) : new EditViewModel();
                var markets = await mediator.Send(new Market.Requests.GetAllRequest());
                var marketSelectList = markets.Markets.Select(market => new SelectListItem(market.Name, market.Id)).ToList();

                viewModel.MarketChoiceOptions = marketSelectList;
                viewModel.MarketChoices = marketSelectList.Select(choice => new MarketChoice(choice.Value, choice.Text, viewModel.Data.EnabledMarkets.Contains(choice.Value))).ToList();

                return View(viewModel);
            }
            catch (Exception ex)
            {
                sentryClient.CaptureException(ex);
                return Json(ex);
            }
        }

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
                model.Data.EnabledMarkets = model.MarketChoices.Where(choice => choice.Enabled).Select(choice => choice.Id).ToList();
                await mediator.Send(new EditRequest(model));

                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                sentryClient.CaptureException(ex);
                return Json(new { success = false, message = "Something went wrong" });
            }
        }

        [HttpPut]
        public async Task<IActionResult> UpdateStatus([Bind] UpdateStatusRequest request)
        {
            try
            {
                await mediator.Send(request);

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