using AutoMapper;
using GamesAdmin.Core.Enumeration;
using GamesAdmin.Core.Models;
using GamesAdmin.Database;
using GamesAdmin.Database.Entities;
using GamesAdmin.Database.Entities.BetChip;
using MongoDB.Bson;
using MongoDB.Driver;
using Sentry;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using System.Threading.Tasks;

namespace GamesAdmin.Api.Market
{
    public interface IMarketService
    {
        Task<bool> Create(Core.Models.Market market);

        Task<IEnumerable<Core.Models.Market>> Get();

        Task<Core.Models.Market> GetByName(string name);

        Task<bool> Update(Core.Models.Market market);

        Task<bool> UpdateStatus(string name, bool enabled);

        Task<bool> UpdateRate(Core.Models.Market market);
    }

    public class MarketService : IMarketService
    {
        private readonly IMapper mapper;
        private readonly ISentryClient sentryClient;
        private readonly IGenericRepository<MarketEntity> repository;
        private readonly IGenericRepository<GameMarketEntity> gameMarketRepository;
        private readonly IGenericRepository<ChipEntity> chipRepository;


        public MarketService(IMapper mapper, ISentryClient sentryClient, 
            IGenericRepository<MarketEntity> repository,
            IGenericRepository<GameMarketEntity> gameMarketRepository,
            IGenericRepository<ChipEntity> chipRepository)
        {
            this.mapper = mapper;
            this.sentryClient = sentryClient;
            this.repository = repository;
            this.gameMarketRepository = gameMarketRepository;
            this.chipRepository = chipRepository;
        }

        public async Task<bool> Create(Core.Models.Market market)
        {
            try
            {
                var entity = new MarketEntity
                {                   
                   Currencies = market.Currencies,
                   Enabled = market.Enabled,
                   Cash = market.Cash,
                   Name = market.Name,
                   DefaultChipId = market.DefaultChipId,
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

        public Task<IEnumerable<Core.Models.Market>> Get() => Task.Run(() =>
        {
            try
            {
                var chipEntities = chipRepository.AsQueryable().ToList();
                var gameMarketEntities = gameMarketRepository.AsQueryable().ToList();
                var allGameIcons = gameMarketEntities.SelectMany(g => g.Markets.Where(m => !string.IsNullOrEmpty(m.IconSize) && m.Enabled).Select(m => {
                    return new GameIcon { 
                        GameName = Enumeration.FromValue<GameType>(g.GameName).DisplayName, 
                        IconSize = m.IconSize, 
                        SortOrder = m.SortOrder, 
                        MarketId = m.MarketId };
                }));
                var gameEntities = repository.AsQueryable().ToList();                
                var result = gameEntities.Select(entity => {
                    var market = mapper.Map<Core.Models.Market>(entity);
                    market.GameIcons = allGameIcons.Where(i => i.MarketId == market.Id).OrderBy(i => i.SortOrder).ToList();
                    market.DefaultChipLabel = chipEntities.FirstOrDefault(c => c.Id.ToString() == market.DefaultChipId)?.Label;

                    return market;
                });

                return result;
            }
            catch (Exception ex)
            {
                sentryClient.CaptureException(ex);

                return Enumerable.Empty<Core.Models.Market>();
            }
        });

        public async Task<Core.Models.Market> GetByName(string name)
        {
            var marketEntity = await repository.FindOneAsync(entity => entity.Name == name);
            if(marketEntity == null)
            {
                return default;
            }

            var chipEntities = chipRepository.AsQueryable().ToList();
            var market = mapper.Map<Core.Models.Market>(marketEntity);
            market.DefaultChipLabel = chipEntities.FirstOrDefault(c => c.Id.ToString() == market.DefaultChipId)?.Label;

            return market;
        }

        public async Task<Core.Models.Market> GetById(string id)
        {
            var marketEntity = await repository.FindByIdAsync(id);

            return marketEntity != null ? mapper.Map<Core.Models.Market>(marketEntity) : default;
        }


        public async Task<bool> Update(Core.Models.Market market)
        {
            try
            {
                var update = Builders<MarketEntity>.Update
                    .Set(x => x.Name, market.Name)
                    .Set(x => x.Currencies, market.Currencies)
                    .Set(x => x.DefaultChipId, market.DefaultChipId)
                    .Set(x => x.Enabled, market.Enabled)
                    .Set(x => x.Cash, market.Cash)
                    .Set(x => x.Time, DateTime.Now);

                await repository.UpdateAsync(config => config.Id == ObjectId.Parse(market.Id), update);

                return true;
            }
            catch (Exception ex)
            {
                sentryClient.CaptureException(ex);
                return false;
            }
        }

        public async Task<bool> UpdateRate(Core.Models.Market market)
        {
            try
            {
                var update = Builders<MarketEntity>.Update
                    .Set(x => x.Rate, market.IsBase ? 1 : market.Rate)
                    .Set(x => x.IsBase, market.IsBase)
                    .Set(x => x.Time, DateTime.Now);

                if (market.IsBase)
                {
                    var currentMarket = await repository.FindByIdAsync(market.Id);
                    var currentMarketRate = currentMarket.Rate;

                    var updateOthers = Builders<MarketEntity>.Update
                        .Set(nameof(MarketEntity.IsBase), false)
                        .Mul(nameof(MarketEntity.Rate), 1 / currentMarketRate);

                    await repository.UpdateManyAsync(config => config.Id != ObjectId.Parse(market.Id), updateOthers);
                }

                await repository.UpdateAsync(config => config.Id == ObjectId.Parse(market.Id), update);

                sentryClient.CaptureMessage($"{market.Name} Rate has been updated", Sentry.Protocol.SentryLevel.Warning);

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
                var update = Builders<MarketEntity>.Update.Set(nameof(MarketEntity.Enabled), enabled);

                await repository.UpdateAsync(config => config.Name == name, update);

                sentryClient.CaptureMessage($"Market {name} enabled: {enabled}");

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
