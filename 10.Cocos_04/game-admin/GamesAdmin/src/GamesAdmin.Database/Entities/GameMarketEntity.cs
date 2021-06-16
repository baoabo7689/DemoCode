using GamesAdmin.Database.Attributes;
using System.Collections.Generic;

namespace GamesAdmin.Database.Entities
{
    [BsonCollection("game_markets")]
    public class GameMarketEntity: MiniGameBaseEntity
    {
        public int GameId { get; set; }

        public string GameName { get; set; }

        public List<GameMarketModel> Markets { get; set; }
    }
}
