namespace GamesAdmin.Site.Features.GameTicketDetail
{
    using GamesAdmin.Core.Enumeration;
    using GamesAdmin.Site._Shared.Configurations;
    using GamesAdmin.Site.Features.GameTicketDetail.ViewModels;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Mvc.Rendering;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    [Authorize]
    public class GameTicketDetailController : Controller
    {
        readonly IGameTicketDetailService gameTicketDetailService;
        readonly IAppSettings appSettings;

        public GameTicketDetailController(IGameTicketDetailService gameTicketDetailService, IAppSettings appSettings)
        {
            this.gameTicketDetailService = gameTicketDetailService;
            this.appSettings = appSettings;
        }

        [HttpGet]
        public IActionResult Index()
        {
            var model = new GameTicketDetailViewModel
            {
                GameTypeItem = Enumeration.GetAll<GameType>().Select(x => new SelectListItem
                {
                    Text = x.DisplayName,
                    Value = ((byte)x.Key).ToString()
                }).ToList(),

                LanguageItem = new List<SelectListItem> {                    
                    new SelectListItem
                    {
                        Text = "English",
                        Value = "en-US"
                    },
                    new SelectListItem
                    {
                        Text = "Indonesia",
                        Value = "id-ID"
                    },
                    new SelectListItem
                    {
                        Text = "Thai",
                        Value = "th-TH"
                    },
                    new SelectListItem
                    {
                        Text = "Chinese Simplified",
                        Value = "zh-CN"
                    },
                    new SelectListItem
                    {
                        Text = "Chinese Traditional",
                        Value = "zh-TW"
                    }
                },
                MemberId = 7934202,
                GameRoundId = 1,
                Auth = new Core.Models.Auth
                {
                    ClientId = this.appSettings.GameRoundResult.AuthenticationClients.Name,
                    ClientKey = this.appSettings.GameRoundResult.AuthenticationClients.Key
                },
                Language = this.appSettings.GameRoundResult.Language
            };

            return View(model);
        }

        [HttpPost]
        public async Task<IActionResult> Index(GameTicketDetailViewModel model)
        {
            var result = await this.gameTicketDetailService.GetUrlAccess(new Requests.GetUrlAccessRequest
            {
                Auth = new Core.Models.Auth
                {
                    ClientId = this.appSettings.GameRoundResult.AuthenticationClients.Name,
                    ClientKey = this.appSettings.GameRoundResult.AuthenticationClients.Key
                },
                GameRoundId = model.GameRoundId,
                GameTypeId = model.GameType,
                ObCustId = model.MemberId,
                Language = model.Language,
                Currency = model.Currency
            });

            return new RedirectResult(result.RedirectUrl);
        }
    }
}
