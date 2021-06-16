using GamesAdmin.Site._Shared.Configurations;
using GamesAdmin.Site._Shared.IdentityServer;
using GamesAdmin.Site.Features._Shared;
using GamesAdmin.Site.Features.Account;
using GamesAdmin.Site.Features.Announcement;
using GamesAdmin.Site.Features.Authentication;
using GamesAdmin.Site.Features.BolaConfig;
using GamesAdmin.Site.Features.BolaReport;
using GamesAdmin.Site.Features.ChipConfig;
using GamesAdmin.Site.Features.ClientSites;
using GamesAdmin.Site.Features.DailySummary;
using GamesAdmin.Site.Features.GameMarket;
using GamesAdmin.Site.Features.GameRoundResult;
using GamesAdmin.Site.Features.GameSettings;
using GamesAdmin.Site.Features.GameTicketDetail;
using GamesAdmin.Site.Features.Market;
using GamesAdmin.Site.Features.Report;
using GamesAdmin.Site.Features.RetrieveEndGameInfo;
using GamesAdmin.Site.Features.SigningCredentialKeys;
using GamesAdmin.Site.Features.Users;
using Microsoft.Extensions.DependencyInjection;
using Refit;

namespace GamesAdmin.Site._Shared.Middlewares
{
    public static class ServiceMiddleware
    {
        public static void AddServices(this IServiceCollection services, IAppSettings appSettings)
        {
            IdentityServerManager.Initialize(appSettings.IdentityServerAuth);

            var refitSettings = new RefitSettings
            {
                AuthorizationHeaderValueGetter = IdentityServerManager.GetAccessToken
            };

            services.AddSingleton(RestService.For<IGameSettingApi>(appSettings.ApiHost, refitSettings));
            services.AddScoped<IGameSettingService, GameSettingService>();

            services.AddSingleton(RestService.For<IAccountApi>(appSettings.ApiHost, refitSettings));
            services.AddScoped<IAccountService, AccountService>();

            services.AddSingleton(RestService.For<IUserApi>(appSettings.ApiHost, refitSettings));
            services.AddScoped<IUserService, UserService>();

            services.AddSingleton(RestService.For<IClientSiteApi>(appSettings.ApiHost, refitSettings));
            services.AddScoped<IClientSiteService, ClientSiteService>();

            services.AddSingleton(RestService.For<IReportApi>(appSettings.ApiHost, refitSettings));
            services.AddScoped<IReportService, ReportService>();

            services.AddScoped<IAuthenticationService, AuthenticationService>();

            services.AddSingleton(RestService.For<IGameServerApi>(appSettings.ApiHost, refitSettings));
            services.AddScoped<IGameServerService, GameServerService>();

            services.AddSingleton(RestService.For<IBolaReportApi>(appSettings.ApiHost, refitSettings));
            services.AddScoped<IBolaReportService, BolaReportService>();

            services.AddSingleton(RestService.For<IBolaConfigApi>(appSettings.ApiHost, refitSettings));
            services.AddScoped<IBolaConfigService, BolaConfigService>();

            services.AddSingleton(RestService.For<IGameRoundResultAPI>(appSettings.GameRoundResult.ResultUrl));
            services.AddScoped<IGameRoundResultService, GameRoundResultService>();

            services.AddSingleton(RestService.For<IGameTicketDetailAPI>(appSettings.GameRoundResult.TicketDetailUrl));
            services.AddScoped<IGameTicketDetailService, GameTicketDetailService>();

            services.AddSingleton(RestService.For<IMarketServiceApi>(appSettings.ApiHost, refitSettings));
            services.AddScoped<IMarketService, MarketService>();

            services.AddSingleton(RestService.For<IGameMarketApi>(appSettings.ApiHost, refitSettings));
            services.AddScoped<IGameMarketService, GameMarketService>();

            services.AddSingleton(RestService.For<IChipConfigApi>(appSettings.ApiHost, refitSettings));
            services.AddScoped<IChipConfigService, ChipConfigService>();
            services.AddSingleton(RestService.For<IDailySummaryApi>(appSettings.ApiHost, refitSettings));
            services.AddScoped<IDailySummaryService, DailySummaryService>();

            services.AddSingleton(RestService.For<IRetrieveEndGameInfoApi>(appSettings.ApiHost, refitSettings));
            services.AddScoped<IRetrieveEndGameInfoService, RetrieveEndGameInfoService>();

            services.AddSingleton(RestService.For<IAnnouncementApi>(appSettings.ApiHost, refitSettings));
            services.AddScoped<IAnnouncementService, AnnouncementService>();

            services.AddSingleton(RestService.For<IGameApi>(appSettings.GameApi.GameApiUrl));

            services.AddSingleton(RestService.For<ISigningCredentialApi>(appSettings.ApiHost, refitSettings));
            services.AddSingleton<ISigningCredentialService, SigningCredentialService>();
        }
    }
}