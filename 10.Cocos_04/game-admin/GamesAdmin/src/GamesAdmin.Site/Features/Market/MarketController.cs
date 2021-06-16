using GamesAdmin.Core;
using GamesAdmin.Site._Shared.Middlewares;
using GamesAdmin.Site.Features.Market.Requests;
using GamesAdmin.Site.Features.Market.ViewModels;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Sentry;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GamesAdmin.Site.Features.Market
{
    [Authorize]
    public class MarketController : Controller
    {
        private readonly IMediator mediator;
        private readonly ISentryClient sentryClient;

        public MarketController(IMediator mediator, ISentryClient sentryClient)
        {
            this.mediator = mediator;
            this.sentryClient = sentryClient;
        }

        [HttpGet]
        [Route("market")]
        public async Task<IActionResult> Index()
        {
            return View(await mediator.Send(new GetAllRequest()));
        }

        [HttpGet]
        public async Task<IActionResult> Rate()
        {
            return View(await mediator.Send(new GetAllRequest()));
        }
        
        [HttpGet]
        [Route("market/EditRate/{name}")]
        public async Task<IActionResult> EditRate(string name)
        {
            var viewModel = await mediator.Send(new EditRateRequest(name));

            return View(viewModel);
        }

        [AuthorizeWithLog(Policy: "admin")]
        [HttpPost]
        [Route("market/EditRate")]
        public async Task<IActionResult> EditRate(EditRateViewModel editViewModel)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return Json(new { success = false, message = allErrors.FirstOrDefault().ErrorMessage });
            }

            try
            {
                await mediator.Send(new EditRateUpdateRequest(editViewModel));
                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                sentryClient.CaptureException(ex);
                return Json(new { success = false, message = Constants.DefaultError });
            }
        }

        [AuthorizeWithLog(Policy: "admin")]
        [HttpGet]
        public async Task<IActionResult> Add()
        => View(await mediator.Send(new AddRequest()));

        [AuthorizeWithLog(Policy: "admin")]
        [HttpPost]
        public async Task<IActionResult> Add([Bind] AddViewModel addViewModel)
        {
            await mediator.Send(new CreateRequest(new Core.Models.Market {
                Id = string.Empty,
                Name = addViewModel.Name,
                Enabled = addViewModel.Enabled,
                Cash = addViewModel.Cash,
                Currencies = addViewModel.Currencies
                    .Split(new char[] { ';', ',' })
                    .Select(x => x.Trim())
                    .ToList(),
                DefaultChipId = addViewModel.DefaultChipId
            }));

            return RedirectToAction(nameof(Index));
        }

        [HttpGet]
        [Route("market/{name}")]
        public async Task<IActionResult> Edit(string name)
        {
            var viewModel = await mediator.Send(new EditRequest(name));                     
            
            return View(viewModel);
        }

        [AuthorizeWithLog(Policy: "admin")]
        [HttpPost]
        [Route("market/update")]
        public async Task<IActionResult> Update([Bind] EditViewModel editViewModel)
        {
            try
            {
                if(string.IsNullOrWhiteSpace(editViewModel.Name) || string.IsNullOrWhiteSpace(editViewModel.Currencies))
                    return Json(false);

                await mediator.Send(new UpdateRequest(new Core.Models.Market { 
                    Id = editViewModel.Id,
                    Name = editViewModel.Name,
                    Enabled = editViewModel.Enabled,
                    Cash = editViewModel.Cash,
                    Currencies = editViewModel.Currencies
                            .Split(new char[] { ';', ',' })
                            .Select(x => x.Trim())
                            .ToList(),
                    DefaultChipId = editViewModel.DefaultChipId
                }));                

                return Json(true);
            }
            catch (System.Exception ex)
            {

                SentrySdk.CaptureException(ex);
            }

            return Json(false);
        }

        [AuthorizeWithLog(Policy: "admin")]
        [HttpPost]
        [Route("market/updatestatus")]
        public async Task<IActionResult> UpdateStatus(string name, bool enabled)
        {
            try
            {
                await mediator.Send(new UpdateStatusRequest(name, enabled));

                return Json(true);
            }
            catch (System.Exception ex)
            {

                SentrySdk.CaptureException(ex);
            }

            return Json(false);
        }
    }
}
