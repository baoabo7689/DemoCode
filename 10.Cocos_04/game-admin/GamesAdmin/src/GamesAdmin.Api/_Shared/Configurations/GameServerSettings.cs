﻿namespace GamesAdmin.Api._Shared.Configurations
{
    public class GameServerSettings
    {
        public GameServerConfigs Main { get; set; }

        public GameServerConfigs Sicbo { get; set; }

        public GameServerConfigs Blackjack { get; set; }

        public GameServerConfigs FishPrawnCrabPro { get; set; }
    }

    public class GameServerConfigs
    {
        public string Api { get; set; }

        public string Socket { get; set; }
    }
}
