using GamesAdmin.Database.Attributes;
using MongoDB.Bson.Serialization.Attributes;

namespace GamesAdmin.Database.Entities
{
    [BsonCollection("bolatangkas_group_results")]
    [BsonIgnoreExtraElements]
    public class BolaTangkasGroupResultEntity
    {
        public long RoundID { get; set; }
        public bool Used { get; set; }
        public byte ResultType { get; set; }
        public bool HasJoker { get; set; }
        public int StakeGroupId { get; set; }
    }
}