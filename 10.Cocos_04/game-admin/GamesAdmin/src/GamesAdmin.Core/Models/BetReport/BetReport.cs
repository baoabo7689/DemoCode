using System;
using System.Collections.Generic;

namespace GamesAdmin.Core.Models
{
    public class BetReport<TRoundResult, TBetRecord> where TRoundResult : RoundResult where TBetRecord : BetRecord
    {
        public TRoundResult RoundResult { get; set; }
        public IEnumerable<TBetRecord> Records { get; set; }
    }

    public class BigSmallBetReport : BetReport<BigSmallRoundResult, BigSmallBetRecord>
    {
    }

    public class BolaTangkasBetReport
    {
        public IEnumerable<BolaTangkasBetRecord> Records { get; set; }
    }

    public class OddEvenBetReport : BetReport<OddEvenRoundResult, OddEvenBetRecord>
    {
    }
}