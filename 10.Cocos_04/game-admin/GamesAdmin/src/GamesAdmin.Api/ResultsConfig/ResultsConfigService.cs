using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using GamesAdmin.Core.Models.BolaTangkas;
using GamesAdmin.Database;
using GamesAdmin.Database.Entities.BolaTangkas;
using GamesAdmin.Database.Entities.BolaTangkas.Model;
using Sentry;

namespace GamesAdmin.Api.ResultsConfig
{
    public interface IResultsConfigService
    {
        Task<BolaTangKasResultsConfigModel> GetByCurency(string curency);

        Task<IEnumerable<BolaTangKasResultsConfigModel>> GetAll(string curency);

        Task<bool> UpdateCurencyConfig(BolaTangKasResultsConfigModel model);

        Task<bool> UpdateStakeConfig(string curency, StakeConfig stakeConfig);

        Task<bool> CreateConfigs(List<BolaTangKasResultsConfigModel> configs);
    }

    public class ResultsConfigService : IResultsConfigService
    {
        private readonly ISentryClient sentryClient;
        private readonly IMapper mapper;
        private readonly IGenericRepository<BolaTangKasResultsConfigEntity> repository;

        public ResultsConfigService(ISentryClient sentryClient, IMapper mapper, IGenericRepository<BolaTangKasResultsConfigEntity> repository)
        {
            this.sentryClient = sentryClient;
            this.repository = repository;
            this.mapper = mapper;
        }

        public async Task<IEnumerable<BolaTangKasResultsConfigModel>> GetAll(string curency)
        {
            var result = await this.repository.FilterByAsync(x => x.Currency.ToLowerInvariant().Contains(curency.ToLowerInvariant()));

            return result.Select(entity => ConvertEntityToModel(entity));
        }

        public async Task<BolaTangKasResultsConfigModel> GetByCurency(string curency)
        {
            var result = await GetByCurencyName(curency);

            return ConvertEntityToModel(result);
        }

        public async Task<bool> UpdateCurencyConfig(BolaTangKasResultsConfigModel model)
        {
            var existEntity = await GetByCurencyName(model.Currency);
            var entity = ConvertModelToEntity(model);

            if (existEntity == null)
            {
                return false;
            }

            if (entity.StakesConfig == null)
            {
                entity.StakesConfig = existEntity.StakesConfig;
            }

            entity.Id = existEntity.Id;
            await repository.ReplaceOneAsync(entity);

            return true;
        }

        public async Task<bool> UpdateStakeConfig(string curency, StakeConfig stakeConfig)
        {
            var existEntity = await GetByCurencyName(curency);

            if (existEntity == null || existEntity.StakesConfig == null)
            {
                return false;
            }

            var existConfig = existEntity.StakesConfig.SingleOrDefault(x => x.Amount == stakeConfig.Amount);

            if (existConfig == null)
            {
                return false;
            }

            existConfig.Results = stakeConfig.Config.Select(x => mapper.Map<CombinationConfigModel>(x)).ToList();

            await repository.ReplaceOneAsync(existEntity);

            return true;
        }

        public async Task<bool> CreateConfigs(List<BolaTangKasResultsConfigModel> configs)
        {
            if (configs == null || configs.Count == 0)
            {
                return false;
            }

            var result = false;

            configs.ForEach(async config =>
            {
                var existConfig = await GetByCurency(config.Currency);

                if (existConfig == null)
                {
                    var entity = ConvertModelToEntity(config);

                    await repository.InsertOneAsync(entity);

                    result = true;
                }
            });

            return result;
        }

        private Task<BolaTangKasResultsConfigEntity> GetByCurencyName(string curency)
        {
            return repository.FindOneAsync(x => x.Currency == curency);
        }

        private BolaTangKasResultsConfigEntity ConvertModelToEntity(BolaTangKasResultsConfigModel model)
        {
            if (model == null)
            {
                return null;
            }

            var entity = new BolaTangKasResultsConfigEntity
            {
                ConfigId = model.Id,
                Currency = model.Currency,
                GroupCurrency = model.GroupCurrency,
                IsEnable = model.IsEnable
            };
            if (model.StakesConfig != null)
            {
                entity.StakesConfig = model.StakesConfig.Select(x => new StakeConfigModel
                {
                    Amount = x.Amount,
                    Results = x.Config.Select(y => new CombinationConfigModel
                    {
                        ConfigId = y.Id,
                        Count = y.Count,
                        Odds = y.Odds,
                        TurnoverPercent = y.TurnoverPercent
                    }).ToList()
                });
            }

            return entity;
        }

        private BolaTangKasResultsConfigModel ConvertEntityToModel(BolaTangKasResultsConfigEntity entity)
        {
            if (entity == null)
            {
                return null;
            }

            var model = new BolaTangKasResultsConfigModel
            {
                Id = entity.ConfigId,
                Currency = entity.Currency,
                GroupCurrency = entity.GroupCurrency,
                IsEnable = entity.IsEnable
            };

            model.StakesConfig = entity.StakesConfig.Select(x => new StakeConfig
            {
                Amount = x.Amount,
                Config = x.Results.Select(y => new CombinationConfig
                {
                    Id = y.ConfigId,
                    Count = y.Count,
                    Odds = y.Odds,
                    TurnoverPercent = y.TurnoverPercent
                }).ToList()
            }).ToList();

            return model;
        }
    }
}