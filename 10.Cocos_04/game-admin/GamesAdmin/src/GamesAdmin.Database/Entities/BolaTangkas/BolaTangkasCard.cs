using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Text;

namespace GamesAdmin.Database.Entities
{
    public class BolaTangkasCard
    {
        public int Rank { get; set; }
        public int Suit { get; set; }
        public string Symbol { get; set; }

        [BsonElement("isHighlight")]
        public bool IsHighLight { get; set; }
    }
}
