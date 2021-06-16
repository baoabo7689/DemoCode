using System.Collections.Generic;

namespace GamesAdmin.Database.Entities.BolaTangkas.Model
{
    public class StakeConfigModel
    {
        public int Amount { get; set; }
        public List<CombinationConfigModel> Results { get; set; }
    }
}