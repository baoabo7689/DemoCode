using System;
using System.Collections.Generic;

namespace GamesAdmin.Core.Models
{
    public class BetRecord
    {
        public string Username { get; set; }

        public string Nickname { get; set; }

        public decimal BetWin { get; set; }

        public DateTimeOffset Time { get; set; }
    }

    public class BigSmallBetRecord : BetRecord
    {
        public bool Select { get; set; }

        public decimal Bet { get; set; }

        public decimal Back { get; set; }
    }

    public class BolaTangkasBetRecord : BetRecord
    {
        public bool Select { get; set; }

        public decimal Bet { get; set; }

        public decimal TotalBet { get; set; }
        
        public List<BolaTangkasCard> Cards { get; set; }
        public int ResultType { get; set; }
        public int ColokanCard { get; set; }
    }

    public class OddEvenBetRecord : BetRecord
    {
        public bool Select { get; set; }

        public decimal Bet { get; set; }

        public decimal Back { get; set; }
    }
}