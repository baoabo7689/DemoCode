using System.Linq;
using System.Threading.Tasks;
using GamesAdmin.Core.Models;
using GamesAdmin.Site._Shared.Middlewares;
using GamesAdmin.Site.Features.ClientSites.Requests;
using GamesAdmin.Site.Features.ClientSites.ViewModels;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GamesAdmin.Site.Features.ClientSites
{
    [AuthorizeWithLog(Policy: "admin")]
    public class ClientSiteController : Controller
    {
        private readonly IMediator mediator;

        public ClientSiteController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> Index()
        {
            var clientSites = await mediator.Send(new GetAllRequest());
            return View(clientSites);
        }

        [HttpGet]
        public async Task<IActionResult> Update(string clientId, string siteId)
        {
            var clientSite = await mediator.Send(new GetRequest(clientId, siteId));
            return View(new UpdateClientSiteViewModel(clientSite));
        }

        [HttpPost]
        public async Task<IActionResult> Update(UpdateClientSiteViewModel viewModel)
        {
            if (ModelState.IsValid)
            {
                await mediator.Send(new UpdateRequest(viewModel));

                return RedirectToAction("Index");
            }

            return View(viewModel);
        }
    }
}