namespace GamesAdmin.Site._Shared.Configurations
{
    public class GameServerSettings
    {
        public GameServerConfigs Main { get; set; }

        public GameServerConfigs Sicbo { get; set; }

        public GameServerConfigs BigSmall { get; set; }

        public GameServerConfigs BigSmallTurbo { get; set; }

        public GameServerConfigs OddEven { get; set; }

        public GameServerConfigs OddEvenTurbo { get; set; }
    }

    public class GameServerConfigs
    {
        public string Api { get; set; }

        public string Socket { get; set; }

        public string SocketRoute { get; set; }
    }
}
