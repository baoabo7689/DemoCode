﻿using System;
using System.Threading.Tasks;
using L1.Features.GameServerCommunicators;
using L1.Features.GameServerCommunicators.DailySummary;
using L1.Features.GameServerCommunicators.RetrieveEndGameInfo;
using L1.Features.OWCommunicators;
using L1.Features.OWCommunicators.EndGame;
using L1.Features.OWCommunicators.EnterPortal;
using L1.Features.OWCommunicators.GetBalance;
using L1.Features.OWCommunicators.PlaceBet;
using L1.Features.OWCommunicators.VoidGame;
using L1.Features.Sites;
using L1.WebApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Sentry;

namespace L1.WebApi.Controllers
{
    [ApiController, Route("[controller]")]
    public class MemberController : ControllerBase
    {
        private readonly IOWCustomerService oWCustomerService;

        public MemberController(IOWCustomerService oWCustomerService)
        {
            this.oWCustomerService = oWCustomerService;
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> EnterPortal([FromBody] MemberEnterPortal model)
        {
            var response = await oWCustomerService.EnterPortal(
                new EnterPortalCall(model.Seq, model.ObCustId, model.SiteId, model.CharacterName, model.FirstLogin));

            return Ok(response);
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> Balance([FromBody] GetBalance model)
        {
            var response = await oWCustomerService.GetBalance(
                new GetBalanceCall(model.ObCustId, model.SiteId));

            return Ok(response);
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> PlaceBet([FromBody] PlaceBet model)
        {
            var placeBetCall = new PlaceBetCall(
                model.ObCustId,
                model.SiteId,
                model.GameRoundId,
                model.GameTypeId,
                model.ChoiceId,
                model.Amount,
                model.Currency,
                model.RoundEndTime,
                model.Ip);
            var response = await oWCustomerService.PlaceBet(placeBetCall);

            return Ok(response);
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> EndGame([FromBody] EndGame model)
        {
            var response = await oWCustomerService.EndGame(
                new EndGameCall(model.ObCustId, model.SiteId, model.GameRoundId, model.GameTypeId, model.TotalAmount, model.TotalWin, model.ValidBetAmount, model.EndTime));

            return Ok(response);
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> VoidGame([FromBody] VoidGame model)
        {
            var response = await oWCustomerService.VoidGame(
                new VoidGameCall(model.ObCustId, model.SiteId, model.GameRoundId, model.GameTypeId, model.Reason));

            return Ok(response);
        }

        [HttpPost]
        [Route("[action]")]
        [AllowAnonymous]
        public async Task<IActionResult> RetrieveEndGameInfo([FromBody] EndGameInfoRequest model, [FromServices] IGameMemberService gameMemberService, [FromServices] ISiteDataService siteDataService)
        {
            if (siteDataService.VerifyClient(model.Auth?.ClientId, model.Auth?.ClientSecret))
            {
                SentrySdk.CaptureMessage($"RetrieveEndGameInfo at {DateTime.Now}");

                var response = await gameMemberService.RetrieveEndGameInfoAsync(new RetrieveEndGameInfoRequest(model.GameRoundId, model.GameTypeId, model.ObCustId, model.SiteId));
                response.Result.Seq = model.Seq;

                return Ok(response);
            }

            return Unauthorized();
        }

        [HttpPost]
        [Route("[action]")]
        [AllowAnonymous]
        public async Task<IActionResult> DailySummarize([FromBody] DailySummary model, [FromServices] IGameMemberService gameMemberService, [FromServices] ISiteDataService siteDataService)
        {
            if (siteDataService.VerifyClient(model.Auth?.ClientId, model.Auth?.ClientSecret))
            {
                var response = await gameMemberService.DailySummary(new DailySummaryRequest(model.SummarizedDate, model.IsCash));
                response.Result.Seq = model.Seq;

                return Ok(response);
            }

            return Unauthorized();
        }
    }
}