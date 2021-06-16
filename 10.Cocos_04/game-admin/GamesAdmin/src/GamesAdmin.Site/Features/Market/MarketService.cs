using GamesAdmin.Site.Features._Shared;
using Refit;
using Sentry;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace GamesAdmin.Site.Features.Market
{
    public interface IMarketServiceApi : IBaseAuthorizationApi
    {
        [Get("/market")]
        Task<IList<Core.Models.Market>> GetAll();

        [Post("/market/")]
        Task<bool> Add([Body] Core.Models.Market market);

        [Get("/market/{name}")]
        Task<Core.Models.Market> GetByName(string name);

        [Put("/market/")]
        Task<bool> Update([Body] Core.Models.Market market);

        [Put("/market/{name}/update_status")]
        Task<bool> UpdateStatus(string name, bool enabled);

        [Post("/market/updaterate")]
        Task<bool> UpdateRate([Body] Core.Models.Market market);
    }

    public interface IMarketService
    {
        Task<IList<Core.Models.Market>> GetAll();

        Task<bool> Add(Core.Models.Market market);

        Task<Core.Models.Market> GetByName(string name);

        Task<bool> Update(Core.Models.Market market);

        Task<bool> UpdateStatus(string name, bool enabled);

        Task<bool> UpdateRate(Core.Models.Market market);
    }

    public class MarketService : IMarketService
    {
        private readonly IMarketServiceApi marketServiceAPI;
        private readonly ISentryClient sentryClient;

        public MarketService(IMarketServiceApi marketServiceAPI, ISentryClient sentryClient)
        {
            this.marketServiceAPI = marketServiceAPI;
            this.sentryClient = sentryClient;
        }

        public async Task<bool> Add(Core.Models.Market market) => await this.marketServiceAPI.Add(market);

        public async Task<IList<Core.Models.Market>> GetAll()
        {
            try
            {
                return await marketServiceAPI.GetAll();
            }
            catch (Exception ex)
            {
                sentryClient.CaptureException(ex);

                return new List<Core.Models.Market>() as IList<Core.Models.Market>;
            }
        }

        public async Task<Core.Models.Market> GetByName(string name) => await marketServiceAPI.GetByName(name);

        public async Task<bool> Update(Core.Models.Market market) => await this.marketServiceAPI.Update(market);

        public async Task<bool> UpdateRate(Core.Models.Market market) => await this.marketServiceAPI.UpdateRate(market);

        public async Task<bool> UpdateStatus(string name, bool enabled) => await this.marketServiceAPI.UpdateStatus(name, enabled); 
    }
}
