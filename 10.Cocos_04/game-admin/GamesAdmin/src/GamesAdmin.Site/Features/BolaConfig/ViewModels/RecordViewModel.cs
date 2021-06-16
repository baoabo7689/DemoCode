using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GamesAdmin.Site.Features.BolaConfig.ViewModels
{
    public class RecordViewModel
    {
        public string Currency { get; set; }

        public List<int> Stakes { get; set; }

        public string GroupCurrency { get; set; }

        public bool IsEnable { get; set; }
    }
}
