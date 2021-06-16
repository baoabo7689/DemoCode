using System;
using GamesAdmin.Database.Attributes;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace GamesAdmin.Database.Entities.DailySummary
{
    [BsonCollection("daily_summaries")]
    public class DailySummaryEntity : Document
    {
        [BsonDateTimeOptions]
        public DateTime Time { get; set; }

        public int GameId { get; set; }

        public string Currency { get; set; }

        [BsonRepresentation(BsonType.Double, AllowTruncation = true)]
        public decimal Stake { get; set; }

        [BsonRepresentation(BsonType.Double, AllowTruncation = true)]
        public decimal Payout { get; set; }

        public int Tickets { get; set; }

        public bool IsCash { get; set; }
    }
}
