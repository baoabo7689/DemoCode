using System.Collections.Generic;

namespace GamesAdmin.Core.Models
{
    public class ClientSite
    {
        public string ClientId { get; set; }

        public string SiteId { get; set; }

        public string GameClientUrl { get; set; }

        public string ChinaUrl { get; set; }

        public string BrandName { get; set; }

        public List<string> ValidCurrencies { get; set; }

        public List<string> SiteNames { get; set; }
    }
}