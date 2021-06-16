using GamesAdmin.Core.Extensions;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace GamesAdmin.Core.Models
{
    public class MaxBetChoice
    {
        public MaxBetChoice() { }

        public MaxBetChoice(string name, double maxBet)
        {
            Name = name;
            MaxBet = maxBet;
        }

        public string Name { get; set; }

        public string DisplayName => Name.UppercaseFirst();

        [Required]
        public double MaxBet { get; set; }
    }
}
