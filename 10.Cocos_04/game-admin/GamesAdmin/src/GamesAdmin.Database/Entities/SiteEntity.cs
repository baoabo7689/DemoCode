using GamesAdmin.Database.Attributes;
using System.Collections.Generic;

namespace GamesAdmin.Database.Entities
{
    [BsonCollection("sites")]
    public class ClientSiteEntity : Document
    {
        public string SiteId { get; set; }

        public string BackendApi { get; set; }

        public string ClientId { get; set; }

        public string ClientSecret { get; set; }

        public string GameClientUrl { get; set; }

        public string ChinaUrl { get; set; }

        public string BrandName { get; set; }

        public List<string> ValidCurrencies { get; set; }

        public List<string> SiteNames { get; set; }
    }
}