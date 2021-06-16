using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Text;

namespace GamesAdmin.Core.Models
{
    public class BolaTangkasCard
    {
        public int Rank { get; set; }
        public int Suit { get; set; }
        public string Symbol { get; set; }
        public bool IsRedSuit { 
            get 
            {
                return Suit < 2;
            }
        }
        public bool IsHighLight { get; set; }
    }
}
