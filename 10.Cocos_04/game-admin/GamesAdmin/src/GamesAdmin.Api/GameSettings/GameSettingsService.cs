using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using GamesAdmin.Core.Enumeration;
using GamesAdmin.Core.Models;
using GamesAdmin.Core.Models.Chip;
using GamesAdmin.Database;
using GamesAdmin.Database.Entities;
using GamesAdmin.Database.Entities.BetChip;
using MongoDB.Bson;
using MongoDB.Driver;
using Sentry;

namespace GamesAdmin.Api.Games
{
    public interface IGameSettingsService
    {
        Task<IEnumerable<GameConfig>> Get();

        Task<bool> Create(GameConfig game);

        Task<bool> Update(GameConfig game);

        Task<GameConfig> GetByName(string name);

        Task<bool> Delete(string name);

        Task<bool> UpdateStatus(string name, bool enabled);

        Task<bool> UpdateDisbledMessage(string name, string disabledMessage);

        Task<IEnumerable<BetChoiceOdds>> GetOdds(string gameName);

        Task<bool> UpdateOdds(string gameName, IEnumerable<BetChoiceOdds> odds);

        Task<bool> ClearSessions();
    }

    public class GameSettingsService : IGameSettingsService
    {
        private readonly IMapper mapper;
        private readonly ISentryClient sentryClient;
        private readonly IGenericRepository<GameConfigEntity> repository;
        private readonly IGenericRepository<GameMarketEntity> gameMarketRepository;
        private readonly IGenericRepository<MarketEntity> marketRepository;
        private readonly IGenericRepository<ChipEntity> chipRepository;
        private readonly ICommandRepository commandRepository;

        private const int DEFAULT_ODDS = 0;

        public GameSettingsService(
            IMapper mapper,
            ISentryClient sentryClient,
            IGenericRepository<GameConfigEntity> repository,
            IGenericRepository<GameMarketEntity> gameMarketRepository,
            IGenericRepository<MarketEntity> marketRepository,
            IGenericRepository<ChipEntity> chipRepository,
            ICommandRepository commandRepository)
        {
            this.repository = repository;
            this.sentryClient = sentryClient;
            this.mapper = mapper;
            this.gameMarketRepository = gameMarketRepository;
            this.marketRepository = marketRepository;
            this.chipRepository = chipRepository;
            this.commandRepository = commandRepository;
        }

        public async Task<IEnumerable<BetChoiceOdds>> GetOdds(string gameName)
        {
            try
            {
                var gameType = Enumeration.FromValue<GameType>(gameName);
                var betChoices = OddsMapper.Map(gameType);
                var gameEntity = await repository.FindOneAsync(gameConfig => gameConfig.name == gameName);

                var result = (gameEntity.Odds == null || gameEntity.Odds.Count == 0) ? betChoices.Select(betChoice => new BetChoiceOdds(betChoice.Value, DEFAULT_ODDS)) :
                    gameEntity.Odds.Select(odds => new BetChoiceOdds(odds.Key, odds.Value));

                return result;
            }
            catch (Exception ex)
            {
                sentryClient.CaptureException(ex);

                return Enumerable.Empty<BetChoiceOdds>();
            }
        }

        public async Task<bool> UpdateOdds(string gameName, IEnumerable<BetChoiceOdds> odds)
        {
            try
            {
                var existEntity = await repository.FindOneAsync(gameConfig => gameConfig.name == gameName);
                var oldOdds = existEntity.Odds;

                existEntity.Odds = odds.ToDictionary(betChoice => betChoice.Name, betChoice => betChoice.Odds);

                await repository.ReplaceOneAsync(existEntity);

                var oddsChanged = oldOdds?.Where(betChoice => oldOdds[betChoice.Key] != existEntity.Odds[betChoice.Key]);

                if (oddsChanged != null && oddsChanged.Any())
                {
                    var message = $"CHANGE ODDS : {gameName} odds has been updated. Details : ";
                    foreach (var item in oddsChanged)
                    {
                        var betChoice = item.Key;
                        message += $"{betChoice} : {oldOdds[betChoice]} -> {existEntity.Odds[betChoice]}; ";
                    }

                    sentryClient.CaptureMessage(message, Sentry.Protocol.SentryLevel.Error);
                }

                return true;
            }
            catch (Exception ex)
            {
                sentryClient.CaptureException(ex);

                return false;
            }
        }

        public Task<IEnumerable<GameConfig>> Get()
        => Task.Run(() =>
            {
                try
                {
                    var chipEntities = this.chipRepository.AsQueryable().ToList();
                    var allChips = chipEntities.Select(d => mapper.Map<ChipModel>(d)).OrderBy(c => c.Value).ToList();
                    var gameEntities = repository.AsQueryable().ToList();
                    var gameMarketEntities = gameMarketRepository.AsQueryable().ToList();
                    var marketEntities = marketRepository.AsQueryable().ToList();
                    var enabledMarkets = marketEntities
                        .Where(market => market.Enabled)
                        .Select(entity => mapper.Map<Core.Models.Market>(entity));

                    return gameEntities.Select(entity =>
                    {
                        var gameConfig = mapper.Map<GameConfig>(entity);
                        var gameMarket = gameMarketEntities.FirstOrDefault(m => m.GameName == entity.name);
                        if (gameMarket != null && gameMarket.Markets != null)
                        {
                            gameConfig.GameMarkets = gameMarket.Markets.Where(m => m.Enabled && enabledMarkets.Select(market => market.Id).Contains(m.MarketId)).Select(m => new Core.Models.GameMarketModel
                            {
                                MarketId = m.MarketId,
                                MarketName = enabledMarkets.FirstOrDefault(s => s.Id == m.MarketId).Name,
                                Enabled = m.Enabled,
                                MinBet = m.MinBet,
                                MaxBet = m.MaxBet,
                                EnabledChips = allChips.Select(c => new ChipChoice
                                {
                                    Id = c.Id,
                                    Label = c.Label,
                                    Enabled = m.EnabledChips == null ? false : m.EnabledChips.Contains(c.Id)
                                }).ToList()
                            }).ToList();
                        }

                        return gameConfig;
                    });
                }
                catch (Exception ex)
                {
                    sentryClient.CaptureException(ex);

                    return Enumerable.Empty<GameConfig>();
                }
            });

        public async Task<bool> Create(GameConfig game)
        {
            try
            {
                var entity = new GameConfigEntity
                {
                    name = game.Name,
                    Enabled = game.Enabled,
                    Maxbet = game.MaxBet,
                    Minbet = game.MinBet,
                    Botenabled = game.BotEnabled,
                    Maxbot = game.MaxBot,
                    DisabledMessage = game.DisabledMessage,
                    Time = DateTime.Now
                };

                await repository.InsertOneAsync(entity);
            }
            catch (Exception ex)
            {
                sentryClient.CaptureException(ex);

                return false;
            }

            return true;
        }

        public async Task<bool> Update(GameConfig game)
        {
            try
            {
                var existEntity = await GetByName(game.Name);

                var entity = mapper.Map<GameConfigEntity>(game);
                entity.Time = DateTime.Now;

                if (entity.HoursMaxBot == null || entity.HoursMaxBot.Length < 24)
                {
                    entity.HoursMaxBot = existEntity.HoursMaxBot;
                }

                await repository.ReplaceOneAsync(entity);

                return true;
            }
            catch (Exception ex)
            {
                sentryClient.CaptureException(ex);

                return false;
            }
        }

        public async Task<GameConfig> GetByName(string name)
        {
            var gameEntity = await repository.FindOneAsync(entity => entity.name == name);

            return gameEntity != null ? mapper.Map<GameConfig>(gameEntity) : default;
        }

        public async Task<bool> Delete(string name)
        {
            try
            {
                await repository.DeleteOneAsync(entity => entity.name == name);

                return true;
            }
            catch (Exception ex)
            {
                sentryClient.CaptureException(ex);

                return false;
            }
        }

        public async Task<bool> UpdateStatus(string name, bool enabled)
        {
            try
            {
                var update = Builders<GameConfigEntity>.Update.Set(nameof(GameConfigEntity.Enabled), enabled);
                await repository.UpdateAsync(config => config.name == name, update);

                sentryClient.CaptureMessage($"Game {name} enabled: {enabled}");

                return true;
            }
            catch (Exception ex)
            {
                sentryClient.CaptureException(ex);

                return false;
            }
        }

        public async Task<bool> UpdateDisbledMessage(string name, string disabledMessage)
        {
            try
            {
                var update = Builders<GameConfigEntity>.Update.Set(nameof(GameConfigEntity.DisabledMessage), disabledMessage);
                await repository.UpdateAsync(config => config.name == name, update);

                return true;
            }
            catch (Exception ex)
            {
                sentryClient.CaptureException(ex);

                return false;
            }
        }

        public async Task<bool> ClearSessions()
        {
            try
            {   
                var command = new JsonCommand<BsonDocument>(@"{update: ""usersessions"", 
                                                             updates: [{
                                                                 q: {sessionId: {$not: / - old/}}, 
                                                                 u: [{$set: {""sessionId"": {""$concat"": [""$sessionId"", "" - old""]}}}],
                                                                 multi:true
                                                             }]}");
                await commandRepository.RunCommandAsync<BsonDocument>(command);

                return true;
            }
            catch (Exception ex)
            {
                sentryClient.CaptureException(ex);

                return false;
            }
        }
    }
}