using System;
using System.ComponentModel;
using GamesAdmin.Site._Shared.IdentityServer;
using Microsoft.Extensions.Configuration;

namespace GamesAdmin.Site._Shared.Configurations
{
    public interface IAppSettings
    {
        string ApiHost { get; }

        IdentityServerAuth IdentityServerAuth { get; }

        string GameServerUrl { get; }

        string GameServerDomainUrl { get; }

        TimeZoneInfo DefaultTimeZone { get; }

        string Env { get; }

        public BolaCurrencySettings BolaTangkas { get;}

        public GameRoundResultSettings GameRoundResult { get; }

        public GameApiSettings GameApi { get; }

        GameServerSettings GameServers { get; }
    }
    public class AppSettings : IAppSettings
    {
        private readonly IConfiguration configuration;

        public AppSettings(IConfiguration configuration)
        {
            this.configuration = configuration;

            ApiHost = GetValue<string>(nameof(ApiHost));
            GameServers = configuration.GetSection(nameof(GameServers)).Get<GameServerSettings>();
            GameServerUrl = GetValue<string>(nameof(GameServerUrl));
            GameServerDomainUrl = GetValue<string>(nameof(GameServerDomainUrl));
            IdentityServerAuth = configuration.GetSection(nameof(IdentityServerAuth)).Get<IdentityServerAuth>();
            DefaultTimeZone = TimeZoneInfo.FindSystemTimeZoneById(GetValue<string>(nameof(DefaultTimeZone)));
            Env = GetValue<string>(nameof(Env));
            BolaTangkas = configuration.GetSection(nameof(BolaTangkas)).Get<BolaCurrencySettings>();
            GameRoundResult = configuration.GetSection(nameof(GameRoundResult)).Get<GameRoundResultSettings>();
            GameApi = configuration.GetSection(nameof(GameApi)).Get<GameApiSettings>();
        }

        public string ApiHost { get; }

        public IdentityServerAuth IdentityServerAuth { get; }

        public TimeZoneInfo DefaultTimeZone { get; }

        public string GameServerUrl { get; }

        public string GameServerDomainUrl { get;  }

        public GameServerSettings GameServers { get; }

        public string Env { get; }

        public T GetValue<T>(string key)
        {
            try
            {
                var value = configuration[key];

                TypeConverter typeConverter = TypeDescriptor.GetConverter(typeof(T));

                return (T)typeConverter.ConvertFromString(value);
            }
            catch (Exception ex)
            {
                throw new InvalidCastException($"Key: {key}", ex);
            }
        }

        public BolaCurrencySettings BolaTangkas { get; }
        public string GameRoundResultUrl { get; }

        public GameRoundResultSettings GameRoundResult { get; }

        public GameApiSettings GameApi { get; }
    }
}
