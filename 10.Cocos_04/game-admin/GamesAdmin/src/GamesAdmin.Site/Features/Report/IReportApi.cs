﻿using System.Collections.Generic;
using System.Threading.Tasks;
using GamesAdmin.Core.Models;
using GamesAdmin.Site.Features._Shared;
using Refit;

namespace GamesAdmin.Site.Features.Report
{
    public interface IReportApi : IBaseAuthorizationApi
    {
        [Get("/report/big_small/round/{roundId}/users/{nickname}?excludeBot={excludeBot}")]
        Task<BigSmallBetReport> GetBigSmallReport(long roundId, string nickname, bool excludeBot);
        [Get("/report/bola_tangkas/round/{roundId}/users/{nickname}")]
        Task<BolaTangkasBetReport> GetBolaTangkasReport(long roundId, string nickname);

        [Get("/report/big_small_turbo/round/{roundId}/users/{nickname}?excludeBot={excludeBot}")]
        Task<BigSmallBetReport> GetBigSmallTurboReport(long roundId, string nickname, bool excludeBot);

        [Get("/report/odd_even/round/{roundId}/users/{nickname}?excludeBot={excludeBot}")]
        Task<OddEvenBetReport> GetOddEvenReport(long roundId, string nickname, bool excludeBot);

        [Get("/report/odd_even_turbo/round/{roundId}/users/{nickname}?excludeBot={excludeBot}")]
        Task<OddEvenBetReport> GetOddEvenTurboReport(long roundId, string nickname, bool excludeBot);

        [Get("/report/bet_history/game/{gameTypeId}/round/{roundId}/user/{nickname}")]
        Task<IEnumerable<T>> GetBetHistory<T>(byte gameTypeId, long roundId, string nickname) where T : BaseBetHistory;
    }
}