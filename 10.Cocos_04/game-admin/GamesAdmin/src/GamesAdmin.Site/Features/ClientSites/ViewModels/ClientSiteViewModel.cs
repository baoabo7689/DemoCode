using System.Collections.Generic;

namespace GamesAdmin.Site.Features.ClientSites.ViewModels
{
    public class ClientSiteViewModel
    {
        public string ClientId { get; set; }

        public string SiteId { get; set; }

        public string GameClientUrl { get; set; }

        public string ChinaUrl { get; set; }

        public string BrandName { get; set; }

        public List<string> ValidCurrencies { get; set; }

        public List<string> SiteNames { get; set; }

        public string ValidCurrenciesText => ValidCurrencies == null ? string.Empty :
            string.Join(", ", ValidCurrencies);

        public string SiteNameText => SiteNames == null ? string.Empty :
            string.Join(", ", SiteNames);
    }
}