using GamesAdmin.Database.Attributes;
using System.Collections.Generic;

namespace GamesAdmin.Database.Entities.BetChip
{
    [BsonCollection("chips")]
    public class ChipEntity : MiniGameBaseEntity
    {
        public ChipTheme Theme { get; set; }
        public string Label { get; set; }
        public int Value { get; set; }
        public bool Enabled { get; set; }
    }
}
