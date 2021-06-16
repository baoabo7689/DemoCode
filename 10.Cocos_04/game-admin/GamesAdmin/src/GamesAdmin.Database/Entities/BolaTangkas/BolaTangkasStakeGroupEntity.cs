using System;
using System.Collections.Generic;
using GamesAdmin.Database.Attributes;
using GamesAdmin.Database.Entities.BolaTangkas.Model;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace GamesAdmin.Database.Entities
{
    [BsonCollection("bolatangkas_stake_groups")]
    [BsonIgnoreExtraElements]
    public class BolaTangkasStakeGroupEntity
    {
        [BsonElement("id")]
        public int CombinationId { get; set; }
        public string Currency { get; set; }
        public int Amount { get; set; }
        public int RemainingCombinations { get; set; }
        [BsonRepresentation(BsonType.Decimal128)]
        public decimal HouseTotalWin { get; set; }
        [BsonRepresentation(BsonType.Decimal128)]
        public decimal HouseTotalLose { get; set; }
        public List<CombinationConfigModel> ResultConfigs { get; set; }
        public bool Enabled { get; set; }
        public DateTime GenerateTime { get; set; }
    }
}