namespace GamesAdmin.Site.Features.GameRoundResult
{
    using GamesAdmin.Site._Shared.Configurations;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using System.Threading.Tasks;

    [Authorize]
    public class GameRoundResultController : Controller
    {
        private readonly IGameRoundResultService gameRoundResultService;
        private readonly IAppSettings appSetting;

        public GameRoundResultController(IGameRoundResultService gameRoundResultService, IAppSettings appSetting)
        {
            this.gameRoundResultService = gameRoundResultService;
            this.appSetting = appSetting;
        }

        public async Task<IActionResult> Index()
        {
           var result = await this.gameRoundResultService.GetUrlAccess(new Requests.GetUrlAccessRequest { 
                Auth = new Core.Models.Auth
                {
                    ClientId = this.appSetting.GameRoundResult.AuthenticationClients.Name,
                    ClientKey = this.appSetting.GameRoundResult.AuthenticationClients.Key
                },
                Language = this.appSetting.GameRoundResult.Language
            });

            return new RedirectResult(result.RedirectUrl);        
        }
    }
}
