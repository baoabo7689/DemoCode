using AutoMapper;
using GamesAdmin.Api._Shared;
using GamesAdmin.Api._Shared.Configurations;
using GamesAdmin.Api.Accounts;
using GamesAdmin.Api.Accounts.ScheduleTasks;
using GamesAdmin.Api.Announcement;
using GamesAdmin.Api.ChipConfig;
using GamesAdmin.Api.ClientSites;
using GamesAdmin.Api.DailySummarize;
using GamesAdmin.Api.GameMarket;
using GamesAdmin.Api.GameRound;
using GamesAdmin.Api.Games;
using GamesAdmin.Api.GameServers;
using GamesAdmin.Api.Market;
using GamesAdmin.Api.Report;
using GamesAdmin.Api.ResultsConfig;
using GamesAdmin.Api.RetrieveEndGameInfo;
using GamesAdmin.Api.SigningCredentialKeys;
using GamesAdmin.Api.Statistic;
using GamesAdmin.Api.UM;
using GamesAdmin.Api.Users;
using GamesAdmin.Core.IdentityServer;
using GamesAdmin.Database;
using GamesAdmin.Database.RetrieveEndGameInfo;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MongoDB.Bson.Serialization.Conventions;
using MongoDB.Driver;
using Refit;
using System;
using System.Reflection;

namespace GamesAdmin.Api
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            var appSettings = new AppSettings(Configuration);

            IdentityServerManager.Initialize(appSettings.IdentityServerAuth);

            var refitSettings = new RefitSettings
            {
                AuthorizationHeaderValueGetter = IdentityServerManager.GetAccessToken
            };

            var dbSettings = Configuration.GetSection(nameof(DatabaseSettings));
            services.Configure<DatabaseSettings>(dbSettings);

            var botSettings = Configuration.GetSection(nameof(BotSettings));
            services.Configure<BotSettings>(botSettings);

            services.AddMediatR(Assembly.GetExecutingAssembly());
            services.AddAutoMapper(typeof(Startup));

            services.AddSingleton<IDatabaseSettings>(sp =>
                sp.GetRequiredService<IOptions<DatabaseSettings>>().Value);
            services.AddSingleton<IBotSettings>(sp =>
               sp.GetRequiredService<IOptions<BotSettings>>().Value);

            var conventionPack = new ConventionPack { new CamelCaseElementNameConvention(), new IgnoreExtraElementsConvention(true) };
            ConventionRegistry.Register("camelCase", conventionPack, t => true);
            var mongoClient = new MongoClient(dbSettings["ConnectionString"]);
            services.AddSingleton<IMongoClient>(mongoClient);

            services.AddSingleton<IAppSettings>(appSettings);
            services.AddSingleton(mongoClient.GetDatabase(dbSettings["DatabaseName"]));

            services.AddSingleton(typeof(IGenericRepository<>), typeof(GenericRepository<>));

            services.AddScoped<ISiteRepository, SiteRepository>();

            services.AddScoped<IBigSmallReportRepository, BigSmallReportRepository>();
            services.AddScoped<IBolaTangkasReportRepository, BolaTangkasReportRepository>();
            services.AddScoped<IStatisticRepository, StatisticRepository>();
            services.AddScoped<IBigSmallTurboReportRepository, BigSmallTurboReportRepository>();
            services.AddScoped<IOddEvenReportRepository, OddEvenReportRepository>();
            services.AddScoped<IOddEvenTurboReportRepository, OddEvenTurboReportRepository>();
            services.AddScoped<IStatisticService, StatisticService>();
            services.AddScoped<IGameSettingsService, GameSettingsService>();
            services.AddScoped<IGameRoundService, GameRoundService>();
            services.AddScoped<IUMService, UMService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IClientSiteSiteSerivce, ClientSiteSerivce>();
            services.AddScoped<IReportService, ReportService>();
            services.AddScoped<IBetHistoryReportRepository, BetHistoryReportRepository>();
            services.AddScoped<IResultsConfigService, ResultsConfigService>();

            services.AddScoped<IMarketService, MarketService>();
            services.AddScoped<IGameMarketService, GameMarketService>();
            services.AddScoped<IChipConfigService, ChipConfigService>();
            services.AddScoped<IRetrieveEndGameInfoService, RetrieveEndGameInfoService>();
            services.AddScoped<IRetrieveEndGameInfoRepository, RetrieveEndGameInfoRepository>();

            services.AddScoped<IDailySummaryRepository, DailySummaryRepository>();
            services.AddScoped<IDailySummaryService, DailySummaryService>();

            services.AddScoped<IAnnouncementService, AnnouncementService>();

            services.AddScoped<ICommandRepository, CommandRepository>();

            services.AddSingleton<IAccountService, AccountService>();
            services.AddSingleton<IHostedService, AddBotBalanceTask>();
            services.AddSingleton<IGameServerService, GameServerService>();
            services.AddSingleton<IOnlineUserApiFactory, OnlineUserApiFactory>();


            services.AddSingleton<ISigningCredentialKeyRepository, SigningCredentialKeyRepository>();
            services.AddSingleton<ISigningCredentialKeyService, SigningCredentialKeyService>();

            services.AddSingleton(RestService.For<ISicBoOnlineUserApi>(appSettings.GameServers.Sicbo.Api, refitSettings));
            services.AddSingleton(RestService.For<IMainOnlineUserApi>(appSettings.GameServers.Main.Api, refitSettings));
            services.AddSingleton(RestService.For<IGameServerApi>(appSettings.GameServers.Main.Api, refitSettings));
            services.AddHealthChecks();
            services.AddSingleton(RestService.For<IBlackjackOnlineUserApi>(appSettings.GameServers.Blackjack.Api, refitSettings));
            services.AddSingleton(RestService.For<IFishPrawnCrabProOnlineUserApi>(appSettings.GameServers.FishPrawnCrabPro.Api, refitSettings));

            services.AddAuthentication("Bearer")
                .AddJwtBearer("Bearer", options =>
                {
                    options.Authority = Configuration["IdentityServer:Issuer"];
                    options.RequireHttpsMetadata = false;
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidAudiences = Configuration.GetSection("IdentityServer:Audiences").Get<string[]>()
                    };
                });

            services
                .AddControllers()
                .AddNewtonsoftJson(options => options.UseMemberCasing());

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc(name: "v1", new OpenApiInfo { Title = "GamesAdmin APIs", Version = "v1" });
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer"
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        Array.Empty<string>()
                    }
                });
            });

            services.AddMvc();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint(url: "/swagger/v1/swagger.json", name: "GamesAdmin APIs v1");
            });

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthentication();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/");
                endpoints.MapHealthChecks("/health");
            });
        }
    }
}