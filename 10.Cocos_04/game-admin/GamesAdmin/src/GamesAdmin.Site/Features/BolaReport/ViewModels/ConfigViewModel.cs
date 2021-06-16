using GamesAdmin.Core.Models.BolaTangkas;
using GamesAdmin.Site.Features._Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GamesAdmin.Site.Features.BolaReport.ViewModels
{
    public class ConfigViewModel : ViewModelBase
    {
        public string Currency { get; set; }

        public int Stake { get; set; }

        public int TabkeIndex { get; set; }

        public List<CombinationConfig> Configs { get; set; }

        public List<CombinationConfig> LeftConfigs { get; set; }

        public List<CombinationConfig> RightConfigs { get; set; }

        public void SplitConfigs()
        {
            var count = Configs.Count;
            var leftConfigs = Configs.GetRange(0, count / 2);
            var rightConfigs = Configs.GetRange(count / 2, count - count / 2);
            LeftConfigs = leftConfigs;
            RightConfigs = rightConfigs;
        }
    }
}
