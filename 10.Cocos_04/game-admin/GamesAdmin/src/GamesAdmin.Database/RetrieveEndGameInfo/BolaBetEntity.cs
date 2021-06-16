using MongoDB.Bson.Serialization.Attributes;

namespace GamesAdmin.Database.RetrieveEndGameInfo
{
    public class BlackjackBetEntity
    {
        public string SiteId { get; set; }

        [BsonElement("id")]
        public long Round { get; set; }

        public int? MemberId { get; set; }
    }
}
