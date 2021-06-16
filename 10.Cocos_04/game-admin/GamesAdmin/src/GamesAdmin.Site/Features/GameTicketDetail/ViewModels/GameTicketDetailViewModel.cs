namespace GamesAdmin.Site.Features.GameTicketDetail.ViewModels
{
    using GamesAdmin.Core.Enumeration;
    using GamesAdmin.Core.Models;
    using Microsoft.AspNetCore.Mvc.Rendering;
    using System.Collections.Generic;

    public class GameTicketDetailViewModel
    {
        public int MemberId { get; set; }

        public long GameRoundId { get; set; }

        public List<SelectListItem> GameTypeItem { get; set; }

        public GameId GameType { get; set; }

        public List<SelectListItem> LanguageItem { get; set; }        

        public string Language { get; set; }

        public string Currency { get; set; }

        public Auth Auth { get; set; }
    }
}
