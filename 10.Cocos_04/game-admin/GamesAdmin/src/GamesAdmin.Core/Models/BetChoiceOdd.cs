using System.ComponentModel.DataAnnotations;
using GamesAdmin.Core.Extensions;

namespace GamesAdmin.Core.Models
{
    public class BetChoiceOdds
    {
        public BetChoiceOdds()
        {
        }

        public BetChoiceOdds(string name, double odds)
        {
            Name = name;
            Odds = odds;
        }

        public string Name { get; set; }

        public string DisplayName => Name.UppercaseFirst();

        [Required]
        [RegularExpression(@"\d+(\.\d{1,2})?")]
        public double Odds { get; set; }
    }
}