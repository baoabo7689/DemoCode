using System.Collections.Generic;

namespace GamesAdmin.Core.Models
{
   public class Market
   {
        public string Id { get; set; }

        public string Name { get; set; }

        public bool Enabled { get; set; }

        public string DefaultChipId { get; set; }

        public string DefaultChipLabel { get; set; }

        public IList<string> Currencies { get; set; }

        public IList<GameIcon> GameIcons { get; set; }

        public double Rate { get; set; }

        public bool IsBase { get; set; }

        public bool Cash { get; set; }
   }
}
