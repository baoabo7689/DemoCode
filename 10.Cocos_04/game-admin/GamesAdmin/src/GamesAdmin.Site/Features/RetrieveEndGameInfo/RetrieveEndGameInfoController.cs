using GamesAdmin.Site._Shared.Configurations;
using GamesAdmin.Site.Features.RetrieveEndGameInfo.Requests;
using GamesAdmin.Site.Features.RetrieveEndGameInfo.ViewModels;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace GamesAdmin.Site.Features.RetrieveEndGameInfo
{
    [Authorize]
    public class RetrieveEndGameInfoController : Controller
    {
        private readonly IAppSettings appSettings;
        private readonly IMediator mediator;

        public RetrieveEndGameInfoController(IAppSettings appSettings, IMediator mediator)
        {
            this.appSettings = appSettings;
            this.mediator = mediator;
        }

        [HttpPost]
        public async Task<IActionResult> RetrieveEndGame(GetEndGameInfoViewModel model)
        {
            var auth = new Core.Models.ApiAuth
            {
                ClientId = this.appSettings.GameApi.GameApiAuthentication.Name,
                ClientSecret = this.appSettings.GameApi.GameApiAuthentication.Key
            };
            model.SiteId = await mediator.Send(new GetSiteIdRequest(model)); 
            var result = await mediator.Send(new RetrieveEndGameRequest(model, auth));
            result.Model = model;

            return View(result);
        }
    }
}
