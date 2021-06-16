using System;
using System.Collections.Generic;
using System.Text;

namespace GamesAdmin.Database.Entities
{
    public class GameMarketModel
    {
        public string MarketId { get; set; }

        public bool Enabled { get; set; }

        public double MinBet { get; set; }

        public double MaxBet { get; set; }

        public string IconSize { get; set; }

        public int SortOrder { get; set; }

        public List<MaxBetChoice> MaxBetChoices { get; set; }

        public List<string> EnabledChips { get; set; }
    }
}
