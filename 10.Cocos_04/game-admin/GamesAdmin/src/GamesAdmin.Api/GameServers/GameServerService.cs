﻿using System;
using System.Threading.Tasks;
using GamesAdmin.Api.GameServers.Requests;
using GamesAdmin.Api.UM.Requests;
using GamesAdmin.Core.Enumeration;
using GamesAdmin.Core.Models;
using Refit;
using Sentry;

namespace GamesAdmin.Api.GameServers
{
    public interface IGameServerService
    {
        Task<bool> UnderMaintenance(UMRequest request);

        Task Reload();

        Task<JsonWebToken> GetJWT(JWTRequest request);

        Task<OnlineUsers> GetOnlineUsers(GameType gameType = null);
    }

    public class GameServerService : IGameServerService
    {
        private readonly IGameServerApi serverApi;
        private readonly ISentryClient sentryClient;
        private readonly IOnlineUserApiFactory onlineUserApiFactory;

        public GameServerService(
            IGameServerApi serverApi,
            ISentryClient sentryClient,
            IOnlineUserApiFactory onlineUserApiFactory)
        {
            this.serverApi = serverApi;
            this.sentryClient = sentryClient;
            this.onlineUserApiFactory = onlineUserApiFactory;
        }

        public Task<JsonWebToken> GetJWT(JWTRequest request)
        {
            try
            {
                return serverApi.GetToken(request);
            }
            catch (Exception ex)
            {
                HandleException(ex);
            }

            return Task.FromResult(new JsonWebToken());
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

        public async Task<bool> UnderMaintenance(UMRequest request)
        {
            try
            {
                var umRequest = new UnderMaintenanceRequest
                {
                    StartTime = request.StartTime.ToUniversalTime(),
                    EndTime = request.EndTime.ToUniversalTime(),
                    IsUM = request.IsUM
                };

                await serverApi.UnderMaintenance(umRequest);

                return true;
            }
            catch (Exception ex)
            {
                HandleException(ex);

                return false;
            }
        }

        public async Task<OnlineUsers> GetOnlineUsers(GameType gameType = null)
        {
            try
            {
                if (gameType == null)
                {
                    return await serverApi.GetAllOnlineUsers();
                }

                var onlineUserService = onlineUserApiFactory.GetOnlineUserApi(gameType);

                return await onlineUserService.GetOnlineUsers(ConvertTypeToGameServerName(gameType));
            }
            catch (Exception ex)
            {
                HandleException(ex);
            }

            return new OnlineUsers();
        }

        private string ConvertTypeToGameServerName(GameType gameType)
        {
            switch (gameType.Value)
            {
                case GameType.ShakeThePlateValue:
                    return "stp";

                case GameType.KenoProMaxValue:
                    return "keno";

                case GameType.BaccaratValue:
                    return "baccarat";

                case GameType.RouletteValue:
                    return "roulette";

                case GameType.SicboValue:
                    return "sicbo";

                case GameType.BlackjackValue:
                    return "blackjack";

                default: return string.Empty;
            }
        }

        private void HandleException(Exception ex, string title = null)
        {
            if (ex is ApiException)
            {
                var apiEx = ex as ApiException;

                if (apiEx != null)
                {
                    sentryClient.CaptureMessage($"Request {apiEx.Uri} error: {apiEx.Message}");
                }
            }

            if (!string.IsNullOrWhiteSpace(title))
            {
                sentryClient.CaptureMessage(title, Sentry.Protocol.SentryLevel.Error);
            }

            sentryClient.CaptureException(ex);
        }
    }
}