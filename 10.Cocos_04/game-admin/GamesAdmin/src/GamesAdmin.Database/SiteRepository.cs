using System.Collections.Generic;
using System.Threading.Tasks;
using GamesAdmin.Database.Entities;
using MongoDB.Driver;

namespace GamesAdmin.Database
{
    public interface ISiteRepository : IGenericRepository<ClientSiteEntity>
    {
        Task UpdateGameClientUrlAsync(string clientId, string siteId, string gameClientUrl, string chinaUrl, string brandName, List<string> validCurrencies, List<string> siteNames);
    }

    public class SiteRepository : GenericRepository<ClientSiteEntity>, ISiteRepository
    {
        public SiteRepository(IMongoClient client) : base(client.GetDatabase("member"))
        {
        }

        public async Task UpdateGameClientUrlAsync(string clientId, string siteId, string gameClientUrl, string chinaUrl, string brandName, List<string> validCurrencies, List<string> siteNames)
        {
            await UpdateAsync(x => x.ClientId == clientId && x.SiteId == siteId, 
                Builders<ClientSiteEntity>.Update.Set(x => x.GameClientUrl, gameClientUrl)
                .Set(x => x.ChinaUrl, chinaUrl)
                .Set(x => x.BrandName, brandName)
                .Set(x => x.ValidCurrencies, validCurrencies)
                .Set(x => x.SiteNames, siteNames));
        }
    }
}