using MongoDB.Bson.Serialization.Attributes;

namespace GamesAdmin.Database.Entities.BolaTangkas.Model
{
    public class CombinationConfigModel
    {
        [BsonElement("id")]
        public string ConfigId { get; set; }
        public int Count { get; set; }
        public int Odds { get; set; }
        public int TurnoverPercent { get; set; }
    }
}