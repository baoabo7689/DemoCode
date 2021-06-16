using GamesAdmin.Core.Models.BolaTangkas;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GamesAdmin.Site._Shared.Configurations
{
    public class BolaCurrencySettings
    {
        public List<BolaTangKasResultsConfigModel> Currencies { get; set; }
        public List<CombinationConfig> DefaultResults { get; set; }
    }
}
