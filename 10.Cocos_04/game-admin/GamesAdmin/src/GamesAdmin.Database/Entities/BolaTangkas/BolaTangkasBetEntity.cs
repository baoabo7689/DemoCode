using GamesAdmin.Database.Attributes;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace GamesAdmin.Database.Entities
{
    [BsonCollection("bolatangkas_bets")]
    [BsonIgnoreExtraElements]
    public class BolaTangkasBetEntity
    {
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime Time { get; set; }
        public long RoundId { get; set; }        
        public decimal Bet { get; set; }        
        public string Uid { get; set; }        
    }
}
