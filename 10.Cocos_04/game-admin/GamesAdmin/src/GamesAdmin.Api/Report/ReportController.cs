using System.Collections.Generic;
using System.Threading.Tasks;
using GamesAdmin.Api._Shared;
using GamesAdmin.Api.Report.Request;
using GamesAdmin.Core.Models;
using GamesAdmin.Core.Models.BolaTangkas;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace GamesAdmin.Api.Report
{
    [Route("api/report")]
    public class ReportController : BaseAuthorizeController
    {
        private readonly IMediator mediator;

        public ReportController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpGet]
        [Route("big_small/round/{roundId}/users/{nickname?}")]
        public async Task<BigSmallBetReport> BigSmall(long roundId, string nickname, bool excludeBot)
           => (await mediator.Send(new BigSmallReportRequest(roundId, nickname, excludeBot)));

        [HttpGet]
        [Route("bola_tangkas/round/{roundId}/users/{nickname?}")]
        public async Task<BolaTangkasBetReport> BolaTangkas(long roundId, string nickname)
           => (await mediator.Send(new BolaTangkasReportRequest(roundId, nickname)));

        [HttpGet]
        [Route("bet_history/game/{gameTypeId}/round/{roundId}/user/{nickname}")]
        public async Task<IEnumerable<BaseBetHistory>> BetHistory(string nickname, long roundId, byte gameTypeId)
            => (await mediator.Send(new GameReportRequest(nickname, roundId, gameTypeId)));

        [HttpGet]
        [Route("big_small_turbo/round/{roundId}/users/{nickname?}")]
        public async Task<BigSmallBetReport> BigSmallTurbo(long roundId, string nickname, bool excludeBot)
            => (await mediator.Send(new BigSmallTurboReportRequest(roundId, nickname, excludeBot)));

        [HttpGet]
        [Route("odd_even/round/{roundId}/users/{nickname?}")]
        public async Task<OddEvenBetReport> OddEven(long roundId, string nickname, bool excludeBot)
            => (await mediator.Send(new OddEvenReportRequest(roundId, nickname, excludeBot)));

        [HttpGet]
        [Route("odd_even_turbo/round/{roundId}/users/{nickname?}")]
        public async Task<OddEvenBetReport> OddEvenTurbo(long roundId, string nickname, bool excludeBot)
            => (await mediator.Send(new OddEvenTurboReportRequest(roundId, nickname, excludeBot)));

        [HttpGet]
        [Route("bola_tangkas_WL/currency/{currency}/stake/{stake}/status/{status}")]
        public async Task<IEnumerable<BolaTangkasWinLossReport>> BolaTangkasWLReport(string currency, int stake, int status)
           => (await mediator.Send(new BolaTangkasWinLossReportRequest(currency, stake, status)));

        [HttpGet]
        [Route("bola_tangkas/stake_config/combinationId/{combinationId}")]
        public async Task<IEnumerable<CombinationConfig>> BolaTangkasStakeConfig(int combinationId)
           => await mediator.Send(new BolaTangkasStakeConfigRequest(combinationId));

        [HttpPut]
        [Route("bola_tangkas/combination_status/update")]
        public async Task<bool> UpdateBolaTangkasCombinationConfig(int combinationId, bool isEnabled)
            => await mediator.Send(new BolaTangkasChangeConfigStatusRequest(combinationId, isEnabled));
    }
}