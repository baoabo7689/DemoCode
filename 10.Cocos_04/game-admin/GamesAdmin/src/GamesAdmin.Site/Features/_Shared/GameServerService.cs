using System;
using System.Threading.Tasks;
using GamesAdmin.Core.Enumeration;
using GamesAdmin.Core.Models;
using GamesAdmin.Site.Features.GameSettings.Requests;
using Refit;
using Sentry;

namespace GamesAdmin.Site.Features._Shared
{
    public interface IGameServerApi : IBaseAuthorizationApi
    {
        [Post("/game_server/reload")]
        Task Reload();

        [Get("/game_server/online_users")]
        Task<OnlineUsers> GetOnlineUsers();

        [Get("/game_server/online_users/{game}")]
        Task<OnlineUsers> GetOnlineUsersOnGame(string game = null);

        [Post("/game_server/jwt")]
        Task<JsonWebToken> GetToken([Body] RequestJWT request);

        [Post("/game_server/um")]
        Task UnderMaintenance(UnderMaintenanceRequest request);
    }

    public interface IGameServerService
    {
        Task Reload();

        Task<OnlineUsers> GetOnlineUsers(string game);

        Task<JsonWebToken> GetJWT(string username, string userAgent);

        Task UnderMaintenance(UnderMaintenanceRequest request);
    }

    public class GameServerService : IGameServerService
    {
        private readonly IGameServerApi serverApi;
        private readonly ISentryClient sentryClient;

        public GameServerService(IGameServerApi serverApi, ISentryClient sentryClient)
        {
            this.serverApi = serverApi;
            this.sentryClient = sentryClient;
        }

        public Task<OnlineUsers> GetOnlineUsers(string game)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(game))
                {
                    return serverApi.GetOnlineUsers();
                }

                return serverApi.GetOnlineUsersOnGame(game);
            }
            catch (Exception ex)
            {
                HandleException(ex);
            }

            return Task.FromResult(new OnlineUsers());
        }

        public async Task Reload()
        {
            try
            {
                await serverApi.Reload();
            }
            catch (Exception ex)
            {
                HandleException(ex);
            }
        }

        public Task<JsonWebToken> GetJWT(string username, string userAgent)
        {
            try
            {
                return serverApi.GetToken(new RequestJWT(username, userAgent));
            }
            catch (Exception ex)
            {
                HandleException(ex);
            }

            return Task.FromResult(new JsonWebToken());
        }

        public async Task UnderMaintenance(UnderMaintenanceRequest request)
        {
            try
            {
                var umRequest = new UnderMaintenanceRequest
                {
                    StartTime = new DateTimeOffset(request.StartTime.Ticks, new TimeSpan(0)),
                    EndTime = new DateTimeOffset(request.EndTime.Ticks, new TimeSpan(0)),
                    IsUM = request.IsUM
                };

                await serverApi.UnderMaintenance(umRequest);
            }
            catch (Exception ex)
            {
                HandleException(ex);
            }
        }

        private void HandleException(Exception ex)
        {
            if (ex is ApiException)
            {
                var apiEx = ex as ApiException;

                if (apiEx != null)
                {
                    sentryClient.CaptureMessage($"Request {apiEx.Uri} error: {apiEx.Message}");
                }
            }

            sentryClient.CaptureException(ex);
        }
    }
}