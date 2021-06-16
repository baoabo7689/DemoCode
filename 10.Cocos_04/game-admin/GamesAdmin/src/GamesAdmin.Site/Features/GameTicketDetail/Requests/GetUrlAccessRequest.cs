namespace GamesAdmin.Site.Features.GameTicketDetail.Requests
{
    using GamesAdmin.Core.Enumeration;
    using GamesAdmin.Core.Models;

    public class GetUrlAccessRequest
    {
        public GameId GameTypeId { get; set; }

        public Auth Auth { get; set; }

        public long GameRoundId { get; set; }

        public int ObCustId { get; set; }

        public string Language { get; set; }

        public string Currency { get; set; }
    }
}
