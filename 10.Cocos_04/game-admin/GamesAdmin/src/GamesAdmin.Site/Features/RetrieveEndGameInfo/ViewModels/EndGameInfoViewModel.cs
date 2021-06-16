using System;

namespace GamesAdmin.Site.Features.RetrieveEndGameInfo.ViewModels
{
    public class EndGameInfoViewModel
    {
        public decimal TotalAmount { get; set; }

        public decimal TotalWin { get; set; }

        public decimal ValidBetAmount { get; set; }

        public string Seq { get; set; }

        public DateTimeOffset? EndTime { get; set; }

        public string ErrorCode { get; set; }

        public string ErrorDescription { get; set; }
    }
}
