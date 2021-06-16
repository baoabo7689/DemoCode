using System.Collections.Generic;
using System.Linq;

namespace GamesAdmin.Site.Features.Market.ViewModels
{
    public class MarketViewModel
    {
        public MarketViewModel(IList<Core.Models.Market> markets)
        {
            this.Markets = markets;
        }

        public IList<Core.Models.Market> Markets { get; }

        public bool CheckedAll { 
            get 
            {
                return !this.Markets.Any(x => !x.Enabled);
            }
        }
    }
}
