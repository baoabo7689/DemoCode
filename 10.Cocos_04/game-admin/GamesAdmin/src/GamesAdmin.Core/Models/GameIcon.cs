using System;
using System.Collections.Generic;
using System.Text;

namespace GamesAdmin.Core.Models
{
    public class GameIcon
    {
        public string MarketId { get; set; }

        public string GameName { get; set; }

        public int SortOrder { get; set; }

        public string IconSize { get; set; }
    }
}
