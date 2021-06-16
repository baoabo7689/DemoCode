using GamesAdmin.Core.Models;
using GamesAdmin.Site.Features._Shared;
using GamesAdmin.Site.Features.ClientSites.ViewModels;
using MediatR;
using System.Linq;

namespace GamesAdmin.Site.Features.ClientSites.Requests
{
    public class UpdateRequest : IRequest<ResultBase>
    {
        public UpdateRequest(UpdateClientSiteViewModel viewModel)
        {
            ClientSite = new ClientSite
            {
                ClientId = viewModel.ClientId,
                SiteId = viewModel.SiteId,
                GameClientUrl = viewModel.GameClientUrl,
                ChinaUrl = viewModel.ChinaUrl,
                BrandName = viewModel.BrandName,
                ValidCurrencies = viewModel.ValidCurrenciesText?.Split(",").Select(c => c.Trim()).Where(c => !string.IsNullOrEmpty(c)).ToList(),
                SiteNames = viewModel.SiteNamesText?.Split(",").Select(c => c.Trim()).Where(c => !string.IsNullOrEmpty(c)).ToList()
            };
        }

        public ClientSite ClientSite { get; }
    }
}