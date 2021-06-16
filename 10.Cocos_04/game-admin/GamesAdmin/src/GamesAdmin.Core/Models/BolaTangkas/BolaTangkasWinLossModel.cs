using System;
using System.Collections.Generic;

namespace GamesAdmin.Core.Models.BolaTangkas
{
    public class BolaTangkasWinLossReport
    {
        public int CombinationIndex { get; set; }
        public decimal TotalBet { get; set; }

        public decimal TotalPayout { get; set; }

        public decimal WinLossAmount { get; set; }

        public int RemainingCombinations { get; set; }

        public List<StakeConfig> ResultConfigs { get; set; }

        public int Stake { get; set; }
        public bool Enable { get; set; }
        public DateTime GenerateTime { get; set; }
    }
}