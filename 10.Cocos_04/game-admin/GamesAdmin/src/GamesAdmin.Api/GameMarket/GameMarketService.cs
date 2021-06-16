using AutoMapper;
using GamesAdmin.Core.Enumeration;
using GamesAdmin.Core.Models;
using GamesAdmin.Core.Models.Chip;
using GamesAdmin.Database;
using GamesAdmin.Database.Entities;
using GamesAdmin.Database.Entities.BetChip;
using Sentry;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GamesAdmin.Api.GameMarket
{
    public interface IGameMarketService
    {
        Task<GameSettingModel> Get(string gameName);

        Task<bool> Update(GameSettingModel gameSetting);
    }

    public class GameMarketService : IGameMarketService
    {
        private readonly IMapper mapper;
        private readonly ISentryClient sentryClient;
        private readonly IGenericRepository<GameMarketEntity> repository;
        private readonly IGenericRepository<MarketEntity> marketRepository;
        private readonly IGenericRepository<GameConfigEntity> gameConfigrepository;
        private readonly IGenericRepository<ChipEntity> chipRepository;

        private const int DEFAULT_MAX_BET = 10;
        private const int DEFAULT_SORT_ORDER = 0;

        public GameMarketService(
            IMapper mapper,
            ISentryClient sentryClient,
            IGenericRepository<GameMarketEntity> repository,
            IGenericRepository<MarketEntity> marketRepository,
            IGenericRepository<GameConfigEntity> gameConfigrepository,
            IGenericRepository<ChipEntity> chipRepository)
        {
            this.repository = repository;
            this.sentryClient = sentryClient;
            this.mapper = mapper;
            this.marketRepository = marketRepository;
            this.gameConfigrepository = gameConfigrepository;
            this.chipRepository = chipRepository;
        }

        public async Task<GameSettingModel> Get(string gameName)
        {
            var gameType = Enumeration.FromValue<GameType>(gameName);
            var betChoices = BetChoiceMapper.Map(gameType);
            var gameId = (int)(gameType.Key);

            var allChips = GetAllChips();
            var existingGameMarketEntity = await GetMarketEntity(gameName);
            var markets = GetAllMarkets().Where(market => market.Enabled);
            var gameEntity = await gameConfigrepository.FindOneAsync(entity => entity.name == gameName);

            var gameSettingModel = (existingGameMarketEntity == null) ?
                BuildExistingGameSettingModel(gameId, gameName, gameEntity, markets, betChoices, allChips) :
                BuildNewGameSettingModel(gameId, gameEntity, markets, betChoices, allChips, existingGameMarketEntity);

            return gameSettingModel;
        }

        public async Task<bool> Update(GameSettingModel gameSetting)
        {
            try
            {
                var existingGameMarketEntity = await GetMarketEntity(gameSetting.GameName);
                var gameEntity = await gameConfigrepository.FindOneAsync(entity => entity.name == gameSetting.GameName);
                var gameMarketEntity = BuildGameMarketEntity(gameSetting);                                
                await UpdateGameMarket(gameMarketEntity, existingGameMarketEntity);
                await UpdateGameConfig(gameEntity, gameSetting);

                sentryClient.CaptureMessage($"{gameSetting.GameName} configuration has been updated", Sentry.Protocol.SentryLevel.Warning);

                return true;
            }
            catch (Exception ex)
            {
                sentryClient.CaptureException(ex);
                return false;
            }
        }

        private List<ChipModel> GetAllChips()
        {
            var chipEntities = this.chipRepository.AsQueryable().OrderBy(c => c.Value).ToList();
            var allChips = chipEntities.Select(d => mapper.Map<ChipModel>(d)).ToList();
            return allChips;
        }

        private IEnumerable<Core.Models.Market> GetAllMarkets()
        {
            var marketEntities = marketRepository.AsQueryable().ToList();
            var markets = marketEntities
                .Select(entity => mapper.Map<Core.Models.Market>(entity));
            return markets;
        }

        private GameSettingModel BuildExistingGameSettingModel(
            int gameId,
            string gameName,
            GameConfigEntity gameEntity,
            IEnumerable<Core.Models.Market> markets,
            IEnumerable<Enumeration> betChoices,
            List<ChipModel> allChips)
        {
            return new GameSettingModel
            {
                GameId = gameId,
                GameName = gameName,
                GameMarkets = BuildNewMarkets(markets, betChoices, gameEntity, allChips).ToList(),
                BotEnabled = gameEntity.Botenabled,
                BotMaxBet = gameEntity.BotMaxBet,
                MinBet = gameEntity.Minbet,
                BotMaxBetChoices = BuildBotMaxBetChoices(gameEntity.MaxBetChoices, betChoices),
                DelayStartTime = gameEntity.DelayStartTime
            };
        }

        private GameSettingModel BuildNewGameSettingModel(
            int gameId,
            GameConfigEntity gameEntity,
            IEnumerable<Core.Models.Market> markets,
            IEnumerable<Enumeration> betChoices,
            List<ChipModel> allChips,
            GameMarketEntity existingGameMarketEntity)
        {
            var existMarkets = existingGameMarketEntity.Markets.Select(m => m.MarketId);
            var newMarkets = markets.Where(m => !existMarkets.Contains(m.Id));
            var addedMarkets = BuildNewMarkets(newMarkets, betChoices, gameEntity, allChips);
            var existingMarkets = BuildExistingMarkets(markets, allChips, existingGameMarketEntity);

            return new GameSettingModel
            {
                GameId = gameId,
                GameName = existingGameMarketEntity.GameName,
                BotEnabled = gameEntity.Botenabled,
                BotMaxBet = gameEntity.BotMaxBet,
                MinBet = gameEntity.Minbet,
                BotMaxBetChoices = BuildBotMaxBetChoices(gameEntity.MaxBetChoices, betChoices),                
                GameMarkets = existingMarkets.Concat(addedMarkets).ToList(),
                DelayStartTime = gameEntity.DelayStartTime
            };
        }

        private IEnumerable<Core.Models.GameMarketModel> BuildExistingMarkets(
            IEnumerable<Core.Models.Market> markets,
            List<ChipModel> allChips,
            GameMarketEntity existingGameMarketEntity
            )
        {
            return existingGameMarketEntity.Markets.Where(m => markets.Select(market => market.Id).Contains(m.MarketId)).Select(s => new Core.Models.GameMarketModel            
                {
                    MarketId = s.MarketId,
                    MarketName = markets.FirstOrDefault(m => m.Id == s.MarketId).Name,
                    Enabled = s.Enabled,
                    MinBet = s.MinBet,
                    MaxBet = s.MaxBet,
                    IconSize = s.IconSize,
                    SortOrder = s.SortOrder,
                    BetChoiceBetSettings = s.MaxBetChoices?.Select(c => new Core.Models.MaxBetChoice(c.Name, c.MaxBet)).ToList(),
                    EnabledChips = allChips.Select(c => new ChipChoice
                    {
                        Id = c.Id,
                        Label = c.Label,
                        Enabled = s.EnabledChips != null && s.EnabledChips.Contains(c.Id)
                    }).ToList()
                });
        }

        private List<Core.Models.MaxBetChoice> BuildBotMaxBetChoices(
            Dictionary<string, double> gameMaxBetChoices, 
            IEnumerable<Enumeration> allBetChoices)
        {
            var maxBetChoices = gameMaxBetChoices != null ?
                    gameMaxBetChoices.Select(c => new Core.Models.MaxBetChoice(c.Key, c.Value)) :
                    allBetChoices.Select(c => new Core.Models.MaxBetChoice(c.Value, DEFAULT_MAX_BET));
            return maxBetChoices.ToList();
        }

        private GameMarketEntity BuildGameMarketEntity(GameSettingModel gameSetting)
        {
            return new GameMarketEntity
            {
                GameId = gameSetting.GameId,
                GameName = gameSetting.GameName.Trim(),
                Markets = gameSetting.GameMarkets.Select(s => new Database.Entities.GameMarketModel
                {
                    MarketId = s.MarketId,
                    MinBet = s.MinBet,
                    MaxBet = s.MaxBet,
                    Enabled = s.Enabled,
                    IconSize = s.IconSize,
                    SortOrder = s.SortOrder,
                    MaxBetChoices = s.BetChoiceBetSettings?
                            .Select(c => new Database.Entities.MaxBetChoice(c.Name.Trim(), c.MaxBet))
                            .ToList(),
                    EnabledChips = s.EnabledChips?.Where(c => c.Enabled).Select(c => c.Id).ToList()
                }).ToList(),
                Time = DateTime.Now
            };
        }

        private async Task UpdateGameMarket(GameMarketEntity entity, GameMarketEntity existEntity)
        {
            if (existEntity != null)
            {
                entity.Id = existEntity.Id;
                await repository.ReplaceOneAsync(entity);
            }
            else
            {
                await repository.InsertOneAsync(entity);
            }
        }

        private async Task UpdateGameConfig(GameConfigEntity gameEntity, GameSettingModel gameSetting)
        {
            if (gameEntity != null)
            {
                gameEntity.Botenabled = gameSetting.BotEnabled;
                gameEntity.BotMaxBet = gameSetting.BotMaxBet;
                gameEntity.Minbet = gameSetting.MinBet;
                gameEntity.DelayStartTime = gameSetting.DelayStartTime;
                gameEntity.MaxBetChoices = gameSetting.BotMaxBetChoices?.ToDictionary(c => c.Name, c => c.MaxBet);
                await gameConfigrepository.ReplaceOneAsync(gameEntity);
            }
        }

        private async Task<GameMarketEntity> GetMarketEntity(string gameName)
        {
            return await repository.FindOneAsync(entity => entity.GameName == gameName);
        }

        private IEnumerable<Core.Models.GameMarketModel> BuildNewMarkets(
            IEnumerable<Core.Models.Market> markets,
            IEnumerable<Enumeration> betChoices,
            GameConfigEntity gameEntity,
            List<ChipModel> allChips)
        {
            return markets.Select(m =>
            {
                return new Core.Models.GameMarketModel
                {
                    MarketId = m.Id,
                    MarketName = m.Name,
                    MinBet = gameEntity.Minbet,
                    MaxBet = gameEntity.Maxbet,
                    IconSize = IconSize.SmallValue,
                    SortOrder = DEFAULT_SORT_ORDER,
                    BetChoiceBetSettings = betChoices?
                        .Select(s => new Core.Models.MaxBetChoice(s.Value, GetMaxBetChoice(gameEntity.MaxBetChoices, s.Value)))
                        .ToList(),                   
                    EnabledChips = allChips.Select(c => new ChipChoice { Id = c.Id, Label = c.Label}).ToList()
                };
            }).ToList();
        }

        private double GetMaxBetChoice(Dictionary<string, double> maxBetChoices, string key)
        {
            return maxBetChoices != null && maxBetChoices.ContainsKey(key) ? maxBetChoices[key] : DEFAULT_MAX_BET;
        }
    }
}
