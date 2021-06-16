using System.Collections.Generic;
using GamesAdmin.Database.Attributes;
using GamesAdmin.Database.Entities.BolaTangkas.Model;
using MongoDB.Bson.Serialization.Attributes;

namespace GamesAdmin.Database.Entities.BolaTangkas
{
    [BsonCollection("bolatangkas_results_config")]
    public class BolaTangKasResultsConfigEntity : Document
    {
        [BsonElement("id")]
        public int ConfigId { get; set; }

        public string Currency { get; set; }
        public IEnumerable<string> GroupCurrency { get; set; }

        public IEnumerable<StakeConfigModel> StakesConfig { get; set; }
        public bool IsEnable { get; set; }
    }
}