using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GamesAdmin.Core.Models;
using GamesAdmin.Database;
using Sentry;

namespace GamesAdmin.Api.ClientSites
{
    public interface IClientSiteSiteSerivce
    {
        Task<bool> UpdateAsync(ClientSite site);

        Task<IEnumerable<ClientSite>> GetAllAsync();

        Task<ClientSite> Get(string clientId, string siteId);
    }

    public class ClientSiteSerivce : IClientSiteSiteSerivce
    {
        private readonly ISiteRepository siteRepository;
        private readonly ISentryClient sentryClient;

        public ClientSiteSerivce(
            ISentryClient sentryClient,
            ISiteRepository siteRepository)
        {
            this.sentryClient = sentryClient;
            this.siteRepository = siteRepository;
        }

        public async Task<IEnumerable<ClientSite>> GetAllAsync()
        {
            var result = await siteRepository.FilterByAsync(x => true);
            return result.Select(x => new ClientSite { 
                ClientId = x.ClientId, SiteId = x.SiteId, GameClientUrl = x.GameClientUrl,
                ChinaUrl = x.ChinaUrl, BrandName = x.BrandName, ValidCurrencies = x.ValidCurrencies,
                SiteNames = x.SiteNames
            });
        }

        public async Task<ClientSite> Get(string clientId, string siteId)
        {
            var clientSiteEntity = await siteRepository.FindOneAsync(x => x.ClientId == clientId && x.SiteId == siteId);
            return new ClientSite { ClientId = clientSiteEntity.ClientId, SiteId = clientSiteEntity.SiteId, 
                GameClientUrl = clientSiteEntity.GameClientUrl, ChinaUrl = clientSiteEntity.ChinaUrl,
                BrandName = clientSiteEntity.BrandName,
                ValidCurrencies = clientSiteEntity.ValidCurrencies, SiteNames = clientSiteEntity.SiteNames
            };
        }

        public async Task<bool> UpdateAsync(ClientSite site)
        {
            try
            {
                await siteRepository.UpdateGameClientUrlAsync(site.ClientId, site.SiteId, site.GameClientUrl, site.ChinaUrl, site.BrandName, site.ValidCurrencies, site.SiteNames);
                sentryClient.CaptureMessage(string.Format("Update ClientSite: clientId: {0}, siteId: {1}, gameClientUrl: {2}, chinaUrl: {3}, brandName: {4}, validCurrencies: {5}, siteNames: {6} ",
                    site.ClientId, site.SiteId, site.GameClientUrl, site.ChinaUrl, site.BrandName, site.ValidCurrencies, site.SiteNames), Sentry.Protocol.SentryLevel.Error);
                return true;
            }
            catch (Exception e)
            {
                sentryClient.CaptureException(e);
                return false;
            }
        }
    }
}