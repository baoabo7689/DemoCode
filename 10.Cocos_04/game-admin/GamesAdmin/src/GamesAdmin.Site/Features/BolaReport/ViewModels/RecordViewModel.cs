using System;

namespace GamesAdmin.Site.Features.BolaReport.ViewModels
{
    public class RecordViewModel
    {
        public string Currency { get; set; }

        public int TableIndex { get; set; }

        public int Stake { get; set; }

        public decimal TotalBet { get; set; }

        public decimal TotalPayout { get; set; }

        public decimal TotalWinloss { get; set; }

        public int RemainingCombination { get; set; }

        public bool IsEnabled { get; set; }
        public DateTime GenerateTime { get; set; }
    }
}
