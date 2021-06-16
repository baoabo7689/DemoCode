using GamesAdmin.Database.Attributes;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;

namespace GamesAdmin.Database.Entities
{
    [BsonCollection("bolatangkas_rounds")]
    [BsonIgnoreExtraElements]
    public class BolaTangkasRoundEntity
    {
        [BsonElement("endTime")]
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime Time { get; set; }

        [BsonElement("id")]
        public long RoundId { get; set; }

        [BsonElement("characterName")]
        public string Nickname { get; set; }

        public string Username { get; set; }

        public decimal Bet { get; set; }
        public decimal TotalBet { get; set; }

        public decimal Win { get; set; }

        public decimal Back { get; set; }

        public string Uid { get; set; }

        public List<BolaTangkasCard> Cards { get; set; }
        public int ResultType { get; set; }

        [BsonElement("colokanCard")]
        public int ColokanCard { get; set; }
    }
}
