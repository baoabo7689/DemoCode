﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using GamesAdmin.Core.Models;
using GamesAdmin.Site._Shared.Configurations;
using GamesAdmin.Site.Features.Report.Requests;
using GamesAdmin.Site.Features.Report.ViewModels;
using MediatR;

namespace GamesAdmin.Site.Features.ClientSites
{
    public class ReportHandler :
        IRequestHandler<GetBigSmallReportRequest, BigSmallReportResultViewModel>,
        IRequestHandler<GetBolaTangkasReportRequest, BolaTangkasReportResultViewModel>,
        IRequestHandler<GetBigSmallTurboReportRequest, BigSmallTurboReportResultViewModel>,
        IRequestHandler<GetOddEvenReportRequest, OddEvenReportResultViewModel>,
        IRequestHandler<GetOddEvenTurboReportRequest, OddEvenTurboReportResultViewModel>,
        IRequestHandler<GetBigSmallBetHistoryRequest, IEnumerable<BigSmallBetHistoryViewModel>>,
        IRequestHandler<GetBigSmallTurboBetHistoryRequest, IEnumerable<BigSmallBetHistoryViewModel>>,
        IRequestHandler<GetOddEvenBetHistoryRequest, IEnumerable<OddEvenBetHistoryViewModel>>,
        IRequestHandler<GetOddEvenTurboBetHistoryRequest, IEnumerable<OddEvenBetHistoryViewModel>>
    {
        private readonly IReportService reportService;
        private readonly IAppSettings appSettings;

        public ReportHandler(IReportService reportService, IAppSettings appSettings)
        {
            this.reportService = reportService;
            this.appSettings = appSettings;
        }

        public async Task<BigSmallReportResultViewModel> Handle(GetBigSmallReportRequest request, CancellationToken cancellationToken)
        {
            var result = await reportService.GetBigSmallReport(request.RoundId, request.Nickname, request.ExcludeBot);

            return new BigSmallReportResultViewModel
            {
                RoundResult = new RoundResultViewModel
                {
                    Number = result.RoundResult.Number,
                    Dice1 = result.RoundResult.Dice1,
                    Dice2 = result.RoundResult.Dice2,
                    Dice3 = result.RoundResult.Dice3,
                },
                Records = result.Records.Select(x => new RecordViewModel
                {
                    Time = TimeZoneInfo.ConvertTime(x.Time, appSettings.DefaultTimeZone),
                    Username = x.Username,
                    Nickname = x.Nickname,
                    Back = x.Back,
                    Bet = x.Bet,
                    BetWin = x.BetWin,
                    Select = x.Select
                })
            };
        }

        public async Task<BolaTangkasReportResultViewModel> Handle(GetBolaTangkasReportRequest request, CancellationToken cancellationToken)
        {
            var result = await reportService.GetBolaTangkasReport(request.RoundId, request.Nickname);

            return new BolaTangkasReportResultViewModel
            {              
                Records = result.Records.Select(x => new BolaTangkasRecordViewModel
                {
                    Time = TimeZoneInfo.ConvertTime(x.Time, appSettings.DefaultTimeZone),
                    Username = x.Username,
                    Nickname = x.Nickname,
                    Bet = x.Bet,
                    TotalBet = x.TotalBet,
                    BetWin = x.BetWin,
                    Select = x.Select,
                    Cards = x.Cards.Select(c => new BolaTangkasCard
                    {
                        Rank = c.Rank,
                        Suit = c.Suit,
                        Symbol = c.Symbol,
                        IsHighLight = c.IsHighLight
                    }).ToList(),                   
                    ResultType = x.ResultType,
                    ColokanCard = x.ColokanCard
                })
            };
        }

        public async Task<BigSmallTurboReportResultViewModel> Handle(GetBigSmallTurboReportRequest request, CancellationToken cancellationToken)
        {
            var result = await reportService.GetBigSmallTurboReport(request.RoundId, request.Nickname, request.ExcludeBot);

            return new BigSmallTurboReportResultViewModel
            {
                RoundResult = new RoundResultViewModel
                {
                    Number = result.RoundResult.Number,
                    Dice1 = result.RoundResult.Dice1,
                    Dice2 = result.RoundResult.Dice2,
                    Dice3 = result.RoundResult.Dice3,
                },
                Records = result.Records.Select(x => new RecordViewModel
                {
                    Time = TimeZoneInfo.ConvertTime(x.Time, appSettings.DefaultTimeZone),
                    Username = x.Username,
                    Nickname = x.Nickname,
                    Back = x.Back,
                    Bet = x.Bet,
                    BetWin = x.BetWin,
                    Select = x.Select
                })
            };
        }

        public async Task<OddEvenReportResultViewModel> Handle(GetOddEvenReportRequest request, CancellationToken cancellationToken)
        {
            var result = await reportService.GetOddEvenReport(request.RoundId, request.Nickname, request.ExcludeBot);

            return new OddEvenReportResultViewModel
            {
                RoundResult = new RoundResultViewModel
                {
                    Number = result.RoundResult.Number,
                    Dice1 = result.RoundResult.Dice1,
                    Dice2 = result.RoundResult.Dice2,
                    Dice3 = result.RoundResult.Dice3,
                },
                Records = result.Records.Select(x => new RecordViewModel
                {
                    Time = TimeZoneInfo.ConvertTime(x.Time, appSettings.DefaultTimeZone),
                    Username = x.Username,
                    Nickname = x.Nickname,
                    Back = x.Back,
                    Bet = x.Bet,
                    BetWin = x.BetWin,
                    Select = x.Select
                })
            };
        }

        public async Task<OddEvenTurboReportResultViewModel> Handle(GetOddEvenTurboReportRequest request, CancellationToken cancellationToken)
        {
            var result = await reportService.GetOddEventTurboReport(request.RoundId, request.Nickname, request.ExcludeBot);

            return new OddEvenTurboReportResultViewModel
            {
                RoundResult = new RoundResultViewModel
                {
                    Number = result.RoundResult.Number,
                    Dice1 = result.RoundResult.Dice1,
                    Dice2 = result.RoundResult.Dice2,
                    Dice3 = result.RoundResult.Dice3,
                },
                Records = result.Records.Select(x => new RecordViewModel
                {
                    Time = TimeZoneInfo.ConvertTime(x.Time, appSettings.DefaultTimeZone),
                    Username = x.Username,
                    Nickname = x.Nickname,
                    Back = x.Back,
                    Bet = x.Bet,
                    BetWin = x.BetWin,
                    Select = x.Select
                })
            };
        }

        public async Task<IEnumerable<BigSmallBetHistoryViewModel>> Handle(GetBigSmallBetHistoryRequest request, CancellationToken cancellationToken)
        {
            var result = await reportService.GetBigSmallBetHistory(request.RoundId, request.Nickname);

            return result.Select(x => new BigSmallBetHistoryViewModel
            {
                Time = TimeZoneInfo.ConvertTimeFromUtc(x.Time, appSettings.DefaultTimeZone),
                BetWin = x.BetWin,
                Refund = x.Refund,
                Round = x.Round,
                BetResult = new BigSmallBetResultViewModel
                {
                    Dices = x.BetResult.Dices
                },
                Choice = new BigSmallBetChoiceViewModel
                {
                    Amount = x.Choice.Amount,
                    Big = x.Choice.Big
                }
            });
        }

        public async Task<IEnumerable<BigSmallBetHistoryViewModel>> Handle(GetBigSmallTurboBetHistoryRequest request, CancellationToken cancellationToken)
        {
            var result = await reportService.GetBigSmallTurboBetHistory(request.RoundId, request.Nickname);

            return result.Select(x => new BigSmallBetHistoryViewModel
            {
                Time = TimeZoneInfo.ConvertTimeFromUtc(x.Time, appSettings.DefaultTimeZone),
                BetWin = x.BetWin,
                Refund = x.Refund,
                Round = x.Round,
                BetResult = new BigSmallBetResultViewModel
                {
                    Dices = x.BetResult.Dices
                },
                Choice = new BigSmallBetChoiceViewModel
                {
                    Amount = x.Choice.Amount,
                    Big = x.Choice.Big
                }
            });
        }

        public async Task<IEnumerable<OddEvenBetHistoryViewModel>> Handle(GetOddEvenBetHistoryRequest request, CancellationToken cancellationToken)
        {
            var result = await reportService.GetOddEvenBetHistory(request.RoundId, request.Nickname);

            return result.Select(x => new OddEvenBetHistoryViewModel
            {
                Time = TimeZoneInfo.ConvertTimeFromUtc(x.Time, appSettings.DefaultTimeZone),
                BetWin = x.BetWin,
                Refund = x.Refund,
                Round = x.Round,
                BetResult = new OddEvenBetResultViewModel
                {
                    Dices = x.BetResult.Dices
                },
                Choice = new OddEvenBetChoiceViewModel
                {
                    Amount = x.Choice.Amount,
                    Even = x.Choice.Even
                }
            });
        }

        public async Task<IEnumerable<OddEvenBetHistoryViewModel>> Handle(GetOddEvenTurboBetHistoryRequest request, CancellationToken cancellationToken)
        {
            var result = await reportService.GetOddEvenTurboBetHistory(request.RoundId, request.Nickname);

            return result.Select(x => new OddEvenBetHistoryViewModel
            {
                Time = TimeZoneInfo.ConvertTimeFromUtc(x.Time, appSettings.DefaultTimeZone),
                BetWin = x.BetWin,
                Refund = x.Refund,
                Round = x.Round,
                BetResult = new OddEvenBetResultViewModel
                {
                    Dices = x.BetResult.Dices
                },
                Choice = new OddEvenBetChoiceViewModel
                {
                    Amount = x.Choice.Amount,
                    Even = x.Choice.Even
                }
            });
        }
    }
}