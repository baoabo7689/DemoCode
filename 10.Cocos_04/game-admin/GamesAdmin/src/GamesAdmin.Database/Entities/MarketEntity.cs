using GamesAdmin.Database.Attributes;
using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;

namespace GamesAdmin.Database.Entities
{
    [BsonCollection("markets")]
    public class MarketEntity : MiniGameBaseEntity
    {
        [BsonElement("marketName")]
        public string Name { get; set; }

        public bool Enabled { get; set; }

        public string DefaultChipId { get; set; }

        public IList<string> Currencies { get; set; }

        public double Rate { get; set; }

        public bool IsBase { get; set; }
    
        public bool Cash { get; set; }
    }
}
