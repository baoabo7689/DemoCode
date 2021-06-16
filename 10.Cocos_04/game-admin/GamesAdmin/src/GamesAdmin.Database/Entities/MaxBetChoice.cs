using System;
using System.Collections.Generic;
using System.Text;

namespace GamesAdmin.Database.Entities
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

        public double MaxBet { get; set; }
    }
}
