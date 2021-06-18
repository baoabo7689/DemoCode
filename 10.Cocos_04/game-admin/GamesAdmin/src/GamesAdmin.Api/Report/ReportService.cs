﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GamesAdmin.Core.Enumeration;
using GamesAdmin.Core.Models;
using GamesAdmin.Core.Models.BolaTangkas;
using GamesAdmin.Database;
using Microsoft.Extensions.DependencyInjection;

namespace GamesAdmin.Api.Report
{
    public interface IReportService
    {
        Task<BigSmallBetReport> GetBigSmallReportAsync(long roundId, string nickname, bool excludeBot);

        Task<BolaTangkasBetReport> GetBolaTangkasReportAsync(long roundId, string nickname);

        Task<IEnumerable<BaseBetHistory>> GetBetHistoryReport(string name, long roundId, byte gameType);

        Task<BigSmallBetReport> GetBigSmallTurboReportAsync(long roundId, string nickname, bool excludeBot);

        Task<OddEvenBetReport> GetOddEvenReportAsync(long roundId, string nickname, bool excludeBot);

        Task<OddEvenBetReport> GetOddEvenTurboReportAsync(long roundId, string nickname, bool excludeBot);

        Task<IEnumerable<BolaTangkasWinLossReport>> GetBolaTangkasWinLossReportAsync(string currency, int stake, int status);

        Task<IEnumerable<CombinationConfig>> GetStakeConfig(int combinationId);

        Task<bool> UpdateConfigStatus(int combinationId, bool enable);
    }

    public class ReportService : IReportService
    {
        private readonly IServiceProvider serviceProvider;

        public ReportService(IServiceProvider serviceProvider)
        {
            this.serviceProvider = serviceProvider;
        }

        public async Task<BigSmallBetReport> GetBigSmallReportAsync(long roundId, string nickname, bool excludeBot)
        {
            var repository = serviceProvider.GetService<IBigSmallReportRepository>();
            var result = await repository.GetAsync(roundId, nickname, excludeBot);

            return new BigSmallBetReport
            {
                RoundResult = new BigSmallRoundResult
                {
                    Number = result.Item1.Number,
                    Dice1 = result.Item1.Dice1,
                    Dice2 = result.Item1.Dice2,
                    Dice3 = result.Item1.Dice3
                },
                Records = result.Item2.Select(x => new BigSmallBetRecord
                {
                    Time = x.Time,
                    Nickname = x.Nickname,
                    Username = x.Username,
                    Select = x.Select,
                    Bet = x.Bet,
                    BetWin = x.BetWin,
                    Back = x.Back
                })
            };
        }

        public async Task<BolaTangkasBetReport> GetBolaTangkasReportAsync(long roundId, string nickname)
        {
            var repository = serviceProvider.GetService<IBolaTangkasReportRepository>();
            var result = await repository.GetAsync(roundId, nickname);

            return new BolaTangkasBetReport
            {
                Records = result.Select(x => new BolaTangkasBetRecord
                {
                    Time = x.Time,
                    Nickname = x.Nickname,
                    Username = x.Username,
                    Bet = x.Bet,
                    TotalBet = x.TotalBet,
                    BetWin = x.Win,
                    Cards = x.Cards.Select(c => new Core.Models.BolaTangkasCard
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

        public async Task<BigSmallBetReport> GetBigSmallTurboReportAsync(long roundId, string nickname, bool excludeBot)
        {
            var repository = serviceProvider.GetService<IBigSmallTurboReportRepository>();
            var result = await repository.GetAsync(roundId, nickname, excludeBot);

            return new BigSmallBetReport
            {
                RoundResult = new BigSmallRoundResult
                {
                    Number = result.Item1.Number,
                    Dice1 = result.Item1.Dice1,
                    Dice2 = result.Item1.Dice2,
                    Dice3 = result.Item1.Dice3
                },
                Records = result.Item2.Select(x => new BigSmallBetRecord
                {
                    Time = x.Time,
                    Nickname = x.Nickname,
                    Username = x.Username,
                    Select = x.Select,
                    Bet = x.Bet,
                    BetWin = x.BetWin,
                    Back = x.Back
                })
            };
        }

        public async Task<OddEvenBetReport> GetOddEvenReportAsync(long roundId, string nickname, bool excludeBot)
        {
            var repository = serviceProvider.GetService<IOddEvenReportRepository>();
            var result = await repository.GetAsync(roundId, nickname, excludeBot);

            return new OddEvenBetReport
            {
                RoundResult = new OddEvenRoundResult
                {
                    Number = result.Item1.Number,
                    Dice1 = result.Item1.Dice1,
                    Dice2 = result.Item1.Dice2,
                    Dice3 = result.Item1.Dice3
                },
                Records = result.Item2.Select(x => new OddEvenBetRecord
                {
                    Time = x.Time,
                    Nickname = x.Nickname,
                    Username = x.Username,
                    Select = x.Select,
                    Bet = x.Bet,
                    BetWin = x.BetWin,
                    Back = x.Back
                })
            };
        }

        public async Task<OddEvenBetReport> GetOddEvenTurboReportAsync(long roundId, string nickname, bool excludeBot)
        {
            var repository = serviceProvider.GetService<IOddEvenTurboReportRepository>();
            var result = await repository.GetAsync(roundId, nickname, excludeBot);

            return new OddEvenBetReport
            {
                RoundResult = new OddEvenRoundResult
                {
                    Number = result.Item1.Number,
                    Dice1 = result.Item1.Dice1,
                    Dice2 = result.Item1.Dice2,
                    Dice3 = result.Item1.Dice3
                },
                Records = result.Item2.Select(x => new OddEvenBetRecord
                {
                    Time = x.Time,
                    Nickname = x.Nickname,
                    Username = x.Username,
                    Select = x.Select,
                    Bet = x.Bet,
                    BetWin = x.BetWin,
                    Back = x.Back
                })
            };
        }

        public async Task<IEnumerable<BaseBetHistory>> GetBetHistoryReport(string name, long roundId, byte gameType)
        {
            switch (gameType)
            {
                case (byte)GameId.BigSmall:
                    return await GetBigSmallBetHistoryAsync(name, roundId);

                case (byte)GameId.BigSmallTurbo:
                    return await GetBigSmallTurboBetHistoryAsync(name, roundId);

                case (byte)GameId.OddEven:
                    return await GetOddEvenBetHistoryAsync(name, roundId);

                case (byte)GameId.OddEvenTurbo:
                    return await GetOddEvenTurboBetHistoryAsync(name, roundId);

                default:
                    break;
            }

            return await GetBigSmallBetHistoryAsync(name, roundId);
        }

        private async Task<IEnumerable<BigSmallBet>> GetBigSmallBetHistoryAsync(string name, long roundId)
        {
            var betHistoryReportRepository = serviceProvider.GetService<IBetHistoryReportRepository>();
            var result = await betHistoryReportRepository.GetBigSmallAsync(roundId, name);

            return result.Select(x =>
            {
                var betResult = new BigSmallBetResult(x.FirstDice, x.SecondDice, x.ThirdDice);
                var betChoice = new BigSmallChoice(x.Select, x.Bet);

                return new BigSmallBet(x.Round, x.Time, x.BetWin, betResult, betChoice, x.Refund);
            });
        }

        private async Task<IEnumerable<BigSmallBet>> GetBigSmallTurboBetHistoryAsync(string name, long roundId)
        {
            var betHistoryReportRepository = serviceProvider.GetService<IBetHistoryReportRepository>();
            var result = await betHistoryReportRepository.GetBigSmallTurboAsync(roundId, name);

            return result.Select(x =>
            {
                var betResult = new BigSmallBetResult(x.FirstDice, x.SecondDice, x.ThirdDice);
                var betChoice = new BigSmallChoice(x.Select, x.Bet);

                return new BigSmallBet(x.Round, x.Time, x.BetWin, betResult, betChoice, x.Refund);
            });
        }

        private async Task<IEnumerable<OddEvenBet>> GetOddEvenBetHistoryAsync(string name, long roundId)
        {
            var betHistoryReportRepository = serviceProvider.GetService<IBetHistoryReportRepository>();
            var result = await betHistoryReportRepository.GetOddEvenAsync(roundId, name);

            return result.Select(x =>
            {
                var betResult = new OddEvenBetResult(x.FirstDice, x.SecondDice, x.ThirdDice);
                var betChoice = new OddEvenChoice(x.Select, x.Bet);

                return new OddEvenBet(x.Round, x.Time, x.BetWin, betResult, betChoice, x.Refund);
            });
        }

        private async Task<IEnumerable<OddEvenBet>> GetOddEvenTurboBetHistoryAsync(string name, long roundId)
        {
            var betHistoryReportRepository = serviceProvider.GetService<IBetHistoryReportRepository>();
            var result = await betHistoryReportRepository.GetOddEvenTurboAsync(roundId, name);

            return result.Select(x =>
            {
                var betResult = new OddEvenBetResult(x.FirstDice, x.SecondDice, x.ThirdDice);
                var betChoice = new OddEvenChoice(x.Select, x.Bet);

                return new OddEvenBet(x.Round, x.Time, x.BetWin, betResult, betChoice, x.Refund);
            });
        }

        private BaseBetHistory TransformGameReportEntityToBetModel(BetHistoryReportEntity entity)
        {
            BaseBetHistory result = null;

            if (entity is FishPrawnCrabReportEntity)
            {
                FishPrawnCrabReportEntity fpcEntity = (FishPrawnCrabReportEntity)entity;

                var betResult = new FishPrawnCrabBetResult(fpcEntity.FirstDice, fpcEntity.SecondDice, fpcEntity.ThirdDice);
                var betChoice = new FishPrawnCrabChoice(fpcEntity.Stag, fpcEntity.Gourd, fpcEntity.Rooster, fpcEntity.Fish, fpcEntity.Crab, fpcEntity.Prawn);

                result = new FishPrawnCrabBet(entity.Round, entity.Time, entity.BetWin, betResult, betChoice);
            }
            else if (entity is ShakeThePlateReportEntity)
            {
                ShakeThePlateReportEntity stpEntity = (ShakeThePlateReportEntity)entity;

                var betResult = new ShakeThePlateBetResult(stpEntity.FirstRedChip, stpEntity.SecondRedChip, stpEntity.ThirdRedChip, stpEntity.FourthRedChip);
                var betChoice = new ShakeThePlateChoice(stpEntity.Even, stpEntity.Odd, stpEntity.ThreeRed, stpEntity.FourRed, stpEntity.ThreeWhite, stpEntity.FourWhite);

                result = new ShakeThePlateBet(entity.Round, entity.Time, entity.BetWin, betResult, betChoice);
            }

            return result;
        }

        public async Task<IEnumerable<BolaTangkasWinLossReport>> GetBolaTangkasWinLossReportAsync(string currency, int stake, int status)
        {
            var repository = serviceProvider.GetService<IBolaTangkasReportRepository>();
            var result = await repository.GetWinLossReport(currency, stake, status);

            return result.Select(x => new BolaTangkasWinLossReport
            {
                CombinationIndex = x.CombinationId,
                RemainingCombinations = x.RemainingCombinations,
                TotalBet = x.HouseTotalWin,
                TotalPayout = x.HouseTotalLose,
                WinLossAmount = x.HouseTotalWin - x.HouseTotalLose,
                ResultConfigs = new List<StakeConfig>(),
                Enable = x.Enabled,
                Stake = x.Amount,
                GenerateTime = x.GenerateTime
            });
        }

        public async Task<IEnumerable<CombinationConfig>> GetStakeConfig(int combinationId)
        {
            var repository = serviceProvider.GetService<IBolaTangkasReportRepository>();
            var result = await repository.GetStakeConfig(combinationId);

            return result.Select(x => new CombinationConfig
            {
                Count = x.Count,
                Id = x.ConfigId,
                Odds = x.Odds,
                TurnoverPercent = x.TurnoverPercent
            });
        }

        public async Task<bool> UpdateConfigStatus(int combinationId, bool enable)
        {
            var repository = serviceProvider.GetService<IBolaTangkasReportRepository>();

            var result = await repository.ChangeConfigStatus(combinationId, enable);

            return result;
        }
    }
}