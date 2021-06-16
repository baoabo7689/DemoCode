using GamesAdmin.Core.Models.BolaTangkas;
using GamesAdmin.Site._Shared.Configurations;
using GamesAdmin.Site.Features.BolaConfig.Requests;
using Sentry;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GamesAdmin.Site.Features.BolaConfig
{
    public interface IBolaConfigService
    {
        Task<IEnumerable<BolaTangKasResultsConfigModel>> GetReport(string currency);
        Task<BolaTangKasResultsConfigModel> GetConfig(string currency);
        Task<bool> Edit(BolaTangKasResultsConfigModel model);
        Task<BolaTangKasResultsConfigModel> GetAmountConfig(string currency, int amount);
        Task<bool> EditAmount(EditAmountRequest request);
        Task<bool> LoadNew(LoadNewRequest request);
    }

    public class BolaConfigService : IBolaConfigService
    {
        private readonly IBolaConfigApi configApi;
        private readonly IAppSettings appSettings;
        private readonly ISentryClient sentryClient;

        public BolaConfigService(IBolaConfigApi configApi, IAppSettings appSettings, ISentryClient sentryClient)
        {
            this.configApi = configApi;
            this.appSettings = appSettings;
            this.sentryClient = sentryClient;
        }

        public async Task<IEnumerable<BolaTangKasResultsConfigModel>> GetReport(string currency)
        {
            return await configApi.GetAll(currency);            
        }

        public async Task<BolaTangKasResultsConfigModel> GetConfig(string currency)
        {
            return await configApi.Get(currency);
        }

        public async Task<bool> Edit(BolaTangKasResultsConfigModel model)
        {
            return await configApi.UpdateCurencyConfig(model);
        }

        public Task<BolaTangKasResultsConfigModel> GetAmountConfig(string currency, int amount)
        {

            throw new NotImplementedException();
        }

        public async Task<bool> EditAmount(EditAmountRequest request)
        {
            return await configApi.UpdateStakeConfig(request.Currency, request.Config);            
        }

        public async Task<bool> LoadNew(LoadNewRequest request)
        {
            var configs = this.appSettings.BolaTangkas.Currencies;
            for (var i = 0; i < configs.Count; i++)
            {
                var stakes = configs[i].StakesConfig.ToList();
                for (var j = 0; j < stakes.Count(); j++)
                {
                    if (stakes[j].Config == null)
                    {
                        stakes[j].Config = this.appSettings.BolaTangkas.DefaultResults;
                    }
                }
            }

            return await configApi.LoadNew(configs);
        }
    }
}
