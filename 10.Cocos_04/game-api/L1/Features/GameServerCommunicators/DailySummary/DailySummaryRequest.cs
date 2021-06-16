using System;

namespace L1.Features.GameServerCommunicators.DailySummary
{
    public class DailySummaryRequest : GameServerRequest
    {
        public DailySummaryRequest(DateTimeOffset summarizedDate, bool isCash)
        {
            SummarizedDate = summarizedDate;
            IsCash = isCash;
        }

        public DateTimeOffset SummarizedDate { get; }

        public bool IsCash { get; set; }
    }
}