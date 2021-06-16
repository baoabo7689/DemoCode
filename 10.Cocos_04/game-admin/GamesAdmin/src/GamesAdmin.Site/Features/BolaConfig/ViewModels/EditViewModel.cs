using GamesAdmin.Site.Features._Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GamesAdmin.Site.Features.BolaConfig.ViewModels
{
    public class EditViewModel : ViewModelBase
    {
        public string Currency { get; set; }

        public string Stakes { get; set; }

        public string GroupCurrency { get; set; }

        public bool IsEnable { get; set; }
    }
}
