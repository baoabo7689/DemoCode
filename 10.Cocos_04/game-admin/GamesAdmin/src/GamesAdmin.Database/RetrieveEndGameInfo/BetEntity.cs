using MongoDB.Bson.Serialization.Attributes;

namespace GamesAdmin.Database.RetrieveEndGameInfo
{
    public class BetEntity
    {
        public string SiteId { get; set; }

        [BsonElement("phien")]
        public long Round { get; set; }
        
        public int? MemberId { get; set; }
    }
}
