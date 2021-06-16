namespace GamesAdmin.Site._Shared.Configurations
{
    public class GameApiSettings
    {
        public string GameApiUrl { get; set; }

        public GameApiAuthentication GameApiAuthentication { get; set; }

    }

    public class GameApiAuthentication
    {
        public string Name { get; set; }
        public string Key { get; set; }
    }
}
