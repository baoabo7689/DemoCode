using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace GamesAdmin.Site.Features.ClientSites.ViewModels
{
    public class UpdateClientSiteViewModel
    {
        public UpdateClientSiteViewModel() { }

        public UpdateClientSiteViewModel(ClientSiteViewModel clientSite) {
            ClientId = clientSite.ClientId;
            SiteId = clientSite.SiteId;
            GameClientUrl = clientSite.GameClientUrl;
            ChinaUrl = clientSite.ChinaUrl;
            BrandName = clientSite.BrandName;
            ValidCurrencies = clientSite.ValidCurrencies;
            ValidCurrenciesText = clientSite.ValidCurrencies == null ?
                string.Empty :
                string.Join(", ", clientSite.ValidCurrencies);
            SiteNames = clientSite.SiteNames;
            SiteNamesText = clientSite.SiteNames == null ?
                string.Empty :
                string.Join(", ", clientSite.SiteNames);
        }

        [Required]
        public string ClientId { get; set; }

        [Required]
        public string SiteId { get; set; }

        [Required]
        [DisplayName("Game Client Url")]
        public string GameClientUrl { get; set; }

        [DisplayName("China Url")]
        public string ChinaUrl { get; set; }

        [DisplayName("Brand Name")]
        public string BrandName { get; set; }

        public List<string> ValidCurrencies { get; set; }

        [DisplayName("Valid Currencies")]
        public string ValidCurrenciesText { get; set; }

        public List<string> SiteNames { get; set; }

        [DisplayName("Site Names")]
        public string SiteNamesText { get; set; }

    }
}