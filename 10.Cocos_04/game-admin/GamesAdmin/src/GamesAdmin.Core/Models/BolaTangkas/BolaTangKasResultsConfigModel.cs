using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace GamesAdmin.Core.Models.BolaTangkas
{
    public class CombinationConfig
    {
        public string Id { get; set; }
        public int Odds { get; set; }

        [Range(0, int.MaxValue)]
        public int Count { get; set; }

        [Range(0, 100)]
        public int TurnoverPercent { get; set; }
    }

    public class StakeConfig
    {
        public int Amount { get; set; }
        public List<CombinationConfig> Config { get; set; }
    }

    public class BolaTangKasResultsConfigModel
    {
        public int Id { get; set; }
        public string Currency { get; set; }
        public IEnumerable<string> GroupCurrency { get; set; }
        public List<StakeConfig> StakesConfig { get; set; }
        public bool IsEnable { get; set; }
    }
}