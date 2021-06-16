using GamesAdmin.Core.Enumeration;

namespace GamesAdmin.Site.Features.RetrieveEndGameInfo.ViewModels
{
    public class GetEndGameInfoViewModel
    {
        public int MemberId { get; set; }

        public long GameRoundId { get; set; }
        
        public GameId GameType { get; set; }
        
        public string Language { get; set; }

        public string SiteId { get; set; }

        //public Auth Auth { get; set; }
    }
}
