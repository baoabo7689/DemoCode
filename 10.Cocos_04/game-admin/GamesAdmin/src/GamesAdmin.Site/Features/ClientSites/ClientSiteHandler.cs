﻿using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using GamesAdmin.Site.Features._Shared;
using GamesAdmin.Site.Features.ClientSites.Requests;
using GamesAdmin.Site.Features.ClientSites.ViewModels;
using MediatR;

namespace GamesAdmin.Site.Features.ClientSites
{
    public class ClientSiteHandler
        : IRequestHandler<GetAllRequest, IEnumerable<ClientSiteViewModel>>,
         IRequestHandler<GetRequest, ClientSiteViewModel>,
         IRequestHandler<UpdateRequest, ResultBase>

    {
        private readonly IClientSiteService clientSiteService;

        public ClientSiteHandler(IClientSiteService clientSiteService)
        {
            this.clientSiteService = clientSiteService;
        }

        public async Task<IEnumerable<ClientSiteViewModel>> Handle(GetAllRequest request, CancellationToken cancellationToken)
        {
            var result = await clientSiteService.GetAllAsync();

            return result.Select(x => new ClientSiteViewModel
            {
                ClientId = x.ClientId,
                SiteId = x.SiteId,
                GameClientUrl = x.GameClientUrl,
                ChinaUrl = x.ChinaUrl,
                BrandName = x.BrandName,
                ValidCurrencies = x.ValidCurrencies,
                SiteNames = x.SiteNames
            });
        }

        public async Task<ClientSiteViewModel> Handle(GetRequest request, CancellationToken cancellationToken)
        {
            var clientSite = await clientSiteService.GetAsync(request.ClientId, request.SiteId);

            return new ClientSiteViewModel
            {
                ClientId = clientSite.ClientId,
                SiteId = clientSite.SiteId,
                GameClientUrl = clientSite.GameClientUrl,
                ChinaUrl = clientSite.ChinaUrl,
                BrandName = clientSite.BrandName,
                ValidCurrencies = clientSite.ValidCurrencies,
                SiteNames = clientSite.SiteNames
            };
        }

        public async Task<ResultBase> Handle(UpdateRequest request, CancellationToken cancellationToken)
        {
            var isSuccess = await clientSiteService.Update(request.ClientSite);

            if (isSuccess)
            {
                return new ResultBase(string.Empty);
            }

            return new ResultBase("Cannot Update");
        }
    }
}