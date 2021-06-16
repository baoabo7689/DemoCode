namespace GamesAdmin.Site.Features.GameRoundResult.Requests
{
    using GamesAdmin.Core.Models;

    public class GetUrlAccessRequest
    {
        public Auth Auth { get; set; }       

        public string Language { get; set; }

        //public string Host { get; set; }
    }   
}
