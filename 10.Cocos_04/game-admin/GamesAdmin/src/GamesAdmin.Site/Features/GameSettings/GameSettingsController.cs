using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GamesAdmin.Core.Enumeration;
using GamesAdmin.Core.Models;
using GamesAdmin.Site._Shared.Configurations;
using GamesAdmin.Site._Shared.Middlewares;
using GamesAdmin.Site.Features.GameSettings.Requests;
using GamesAdmin.Site.Features.GameSettings.ViewModels;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Sentry;

namespace GamesAdmin.Site.Features.GameSettings
{
    [Authorize]
    public class GameSettingsController : Controller
    {
        private readonly IMediator mediator;
        private readonly ISentryClient sentryClient;
        private readonly IAppSettings appSettings;

        public GameSettingsController(IMediator mediator, ISentryClient sentryClient, IAppSettings appSettings)
        {
            this.mediator = mediator;
            this.sentryClient = sentryClient;
            this.appSettings = appSettings;
        }

        [HttpGet]
        [Route("getodds/{gameName}")]
        public async Task<IActionResult> GetOdds(string gameName)
        => View("OddsSettings", await mediator.Send(new GetOddsRequest(gameName)));


        [AuthorizeWithLog(Policy: "admin")]
        [HttpPut]
        [Route("updateodds")]
        public async Task<IActionResult> UpdateOdds(EditOddsViewModel model)
        {
            try
            {
                await mediator.Send(new UpdateOddsRequest(model.GameName, model.Odds));

                return Json(new { Success = true });
            }
            catch (Exception ex)
            {
                sentryClient.CaptureException(ex);
            }

            return Json(new { Success = false });
        }
        

        [HttpGet]
        public async Task<IActionResult> Edit()
        => View(await mediator.Send(new EditRequest(GameType.BigSmall.Value)));

        [HttpGet]
        [Route("{name}")]
        public async Task<IActionResult> Edit(string name, bool isSuccess = false, string errorMessage = null)
        {
            var viewModel = await mediator.Send(new EditRequest(name));
            viewModel.ErrorMessage = TempData["errorMessage"]?.ToString();
            viewModel.Success = TempData["isSuccess"] == null ? false : (bool)TempData["isSuccess"];

            return View(viewModel);
        }

        [AuthorizeWithLog(Policy: "admin")]
        [HttpPost]
        [Route("/update")]
        public async Task<IActionResult> Update([Bind] EditViewModel editViewModel)
        {
            try
            {
                await mediator.Send(new UpdateRequest(new GameConfig(
                   editViewModel.Id,
                   editViewModel.Name,
                   editViewModel.MinBet,
                   editViewModel.MaxBet,
                   editViewModel.Enabled,
                   editViewModel.BotEnabled,
                   editViewModel.MaxBot,
                   null,
                   0,
                   editViewModel.BotMaxBet,
                   null,
                   editViewModel.DisabledMessage,
                   editViewModel.MaxBetChoices)));

                return Json(true);
            }
            catch (Exception ex)
            {
                sentryClient.CaptureException(ex);
            }

            return Json(false);
        }

        [AuthorizeWithLog(Policy: "admin")]
        [HttpGet]
        public async Task<IActionResult> Add()
        => View(await mediator.Send(new AddRequest()));

        [AuthorizeWithLog(Policy: "admin")]
        [HttpPost]
        public async Task<IActionResult> Add([Bind] AddViewModel addViewModel)
        {
            //TODO set max bet per choice 
            await mediator.Send(new CreateRequest(new GameConfig(
                string.Empty,
                addViewModel.Name,
                addViewModel.MinBet,
                addViewModel.MaxBet,
                addViewModel.Enabled,
                addViewModel.BotEnabled,
                addViewModel.MaxBot,
                null,
                0,
                0,
                new double[] { },
                string.Empty,
                new Dictionary<string, double>())));

            return RedirectToAction(nameof(Index));
        }

        [HttpGet]
        [Route("{id}/Delete")]
        public async Task<IActionResult> Delete(string id)
        {
            await mediator.Send(new DeleteRequest(id));

            return RedirectToAction(nameof(Edit));
        }

        [AcceptVerbs("GET")]
        public async Task<IActionResult> VerifyName(string name)
        {
            var isExist = await mediator.Send(new IsExistRequest(name));

            return isExist ? Json($"A config named {name} already exists.") : Json(true);
        }

        [AuthorizeWithLog(Policy: "admin")]
        [HttpPost]
        [Route("{name}")]
        public async Task<IActionResult> UpdateBotRatio(string name, [Bind] List<BotRatioItemViewModel> botRatioItems)
        {
            var botRatios = botRatioItems
                .OrderBy(item => item.UtcHour)
                .Select(item => item.BotRatio / 100)
                .ToArray();

            await mediator.Send(new UpdateBotRatioRequest(name, botRatios));

            TempData["isSuccess"] = true;

            return Json(true);
        }

        [HttpGet]
        public async Task<IActionResult> GameSettings()
            => View("~/Features/GameSettings/Views/GameManagement.cshtml", await mediator.Send(new GetStatusRequest()));

        [HttpGet]
        public async Task<IActionResult> Index()
            => View("~/Features/GameSettings/Views/GameMonitor.cshtml", await mediator.Send(new GetStatusRequest()));


        [HttpGet]
        [Route("gamedetails/{name}")]
        public async Task<IActionResult> GameDetails(string name)
        {
            var viewModel = await mediator.Send(new EditRequest(name));
            viewModel.ErrorMessage = TempData["errorMessage"]?.ToString();
            viewModel.Success = TempData["isSuccess"] == null ? false : (bool)TempData["isSuccess"];
            viewModel.DisabledShowBot = StatusItemViewModel.gameDisabledShowBot.Contains(name);

            return View(viewModel);
        }

        [HttpGet]
        [Route("botratio/{gameName}")]
        public async Task<IActionResult> BotRatio(string gameName)
        {
            var gameSetting = await mediator.Send(new EditRequest(gameName));

            return Json(gameSetting);
        }

        [AuthorizeWithLog(Policy: "admin")]
        [HttpPost]
        [Route("status/enable")]
        public async Task<IActionResult> EnableGames(string[] games, bool reload = false)
        {
            var result = await mediator.Send(new UpdateMultipleGameStatusRequest(games, true, reload));

            return Json(result);
        }

        [AuthorizeWithLog(Policy: "admin")]
        [HttpPost]
        [Route("status/disable")]
        public async Task<IActionResult> DisableGames(string[] games, bool reload = false)
        {
            var result = await mediator.Send(new UpdateMultipleGameStatusRequest(games, false, reload));

            return Json(result);
        }

        [AuthorizeWithLog(Policy: "admin")]
        [HttpPost]
        [Route("status")]
        public async Task<IActionResult> UpdateDisabledMessage(string name, string disabledMessage)
        {
            if (string.IsNullOrWhiteSpace(disabledMessage))
            {
                TempData["errorMessage"] = "Message cannot be empty.";
                return Json(false);
            }
            else
            {
                await mediator.Send(new UpdateDisabledMessageRequest(name, disabledMessage));
                return Json(true);
            }
        }

        [AuthorizeWithLog(Policy: "admin")]
        [HttpPost]
        [Route("status/update")]
        public async Task<IActionResult> UpdateAllDisabledMessage(string disabledMessage)
        {
            if (string.IsNullOrWhiteSpace(disabledMessage))
            {
                TempData["errorMessage"] = "Message cannot be empty.";
                return Json(false);
            }
            else
            {
                await mediator.Send(new UpdateAllDisabledMessageRequest(disabledMessage));
                return Json(true);
            }
        }

        [AuthorizeWithLog(Policy: "admin")]
        [HttpPost]
        [Route("status/reload")]
        public async Task<IActionResult> ReloadGameClients()
        {
            var result = await mediator.Send(new ReloadGameClientRequest());

            return Json(result);
        }

        [AuthorizeWithLog(Policy: "admin")]
        [HttpPost]
        [Route("clearsessions")]
        public async Task<IActionResult> ClearSessions()
        {
            var result = await mediator.Send(new ClearSessionsRequest());

            return Json(result);
        }

        [Route("status/um")]
        public IActionResult UnderMaintenance()
        => View(new UnderMaintenanceViewModel());

        [AuthorizeWithLog(Policy: "admin")]
        [HttpPost]
        [Route("status/um")]
        public async Task<IActionResult> UnderMaintenance([Bind] UnderMaintenanceRequest request)
        {
            var result = await mediator.Send(request);

            return Json(result);
        }

        [HttpPost]
        [Route("/jwt")]
        public async Task<IActionResult> JWT([FromBody] GetJWTRequest request)
        {
            request.Username = HttpContext.User.Claims.FirstOrDefault(c => c.Type == "Username")?.Value;

            var result = await mediator.Send(request);

            HttpContext.Response.Cookies.Append("token", result.Token);
            HttpContext.Response.Cookies.Append("game-server-endpoint", result.GameServerEndpoint);
            HttpContext.Response.Cookies.Append("sicbo-server-endpoint", appSettings.GameServers.Sicbo.Socket);
            HttpContext.Response.Cookies.Append("sicbo-server-endpoint-route", appSettings.GameServers.Sicbo.SocketRoute ?? string.Empty);
            HttpContext.Response.Cookies.Append("tai-xiu-server-endpoint", appSettings.GameServers.BigSmall.Socket);
            HttpContext.Response.Cookies.Append("binarygames-server-endpoint-route", appSettings.GameServers.BigSmall.SocketRoute ?? string.Empty);
            HttpContext.Response.Cookies.Append("tai-xiu-turbo-server-endpoint", appSettings.GameServers.BigSmallTurbo.Socket);
            HttpContext.Response.Cookies.Append("binarygames-server-endpoint-route", appSettings.GameServers.BigSmallTurbo.SocketRoute ?? string.Empty);
            HttpContext.Response.Cookies.Append("chan-le-server-endpoint", appSettings.GameServers.OddEven.Socket);
            HttpContext.Response.Cookies.Append("binarygames-server-endpoint-route", appSettings.GameServers.OddEven.SocketRoute ?? string.Empty);
            HttpContext.Response.Cookies.Append("chan-le-turbo-server-endpoint", appSettings.GameServers.OddEvenTurbo.Socket);
            HttpContext.Response.Cookies.Append("binarygames-server-endpoint-route", appSettings.GameServers.OddEvenTurbo.SocketRoute ?? string.Empty);
            HttpContext.Response.Cookies.Append("env", result.Env);

            return Json(result);
        }
    }
}