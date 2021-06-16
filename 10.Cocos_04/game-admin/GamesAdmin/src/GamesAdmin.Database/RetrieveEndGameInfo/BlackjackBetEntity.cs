using MongoDB.Bson.Serialization.Attributes;

namespace GamesAdmin.Database.RetrieveEndGameInfo
{
    public class BolaBetEntity
    {
        public string SiteId { get; set; }

        [BsonElement("id")]
        public long Round { get; set; }

        public int? MemberId { get; set; }
    }
}
