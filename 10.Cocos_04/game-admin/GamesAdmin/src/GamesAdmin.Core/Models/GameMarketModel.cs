using GamesAdmin.Core.CustomAttributes;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace GamesAdmin.Core.Models
{
    public class GameMarketModel
    {   
        public string MarketId { get; set; }
        public string MarketName { get; set; }
        public bool Enabled { get; set; }

        [Required(ErrorMessage = "Mininum Bet could not empty")]
        [Range(0.01, int.MaxValue)]
        [DisplayName("Minimum Bet Limit")]
        public double MinBet { get; set; }

        [Required(ErrorMessage = "Maximum Bet could not empty")]
        [Range(0.01, int.MaxValue)]
        [DisplayName("Maximum Bet Limit")]
        [DoubleGreaterThanOrEqual("MinBet", ErrorMessage = "MinBet must less than or equal to MaxBet")]        
        public double MaxBet { get; set; }

        [DisplayName("Icon Size")]
        public string IconSize { get; set; }

        [DisplayName("Sort Order")]
        public int SortOrder { get; set; }

        public List<MaxBetChoice> BetChoiceBetSettings { get; set; }

        public bool DisplayMaxBetChoices => MaxBetChoices?.Count > 2;

        public Dictionary<string, double> MaxBetChoices
            => BetChoiceBetSettings?.ToDictionary(x => x.Name, x => x.MaxBet);

        public List<ChipChoice> EnabledChips { get; set; }
    }
}
