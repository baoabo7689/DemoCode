using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GamesAdmin.Core.Models;
using GamesAdmin.Site.Features._Shared;

namespace GamesAdmin.Site.Features.GameSettings.ViewModels
{
    public class EditOddsViewModel : ViewModelBase
    {
        public string GameName { get; set; }
        public List<BetChoiceOdds> Odds { get; set; }
    }
}
