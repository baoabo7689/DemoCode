﻿using System.Threading;
using System.Threading.Tasks;
using GamesAdmin.Api.GameServers.Requests;
using GamesAdmin.Core.Enumeration;
using GamesAdmin.Core.Models;
using MediatR;

namespace GamesAdmin.Api.GameServers
{
    public class GameServerHandler
        : IRequestHandler<ReloadRequest, bool>
        , IRequestHandler<JWTRequest, JsonWebToken>
        , IRequestHandler<OnlineUserRequest, OnlineUsers>
        , IRequestHandler<UnderMaintenanceRequest, bool>
    {
        private readonly IGameServerService gameServerService;

        public GameServerHandler(IGameServerService gameServerService)
        {
            this.gameServerService = gameServerService;
        }

        public async Task<bool> Handle(ReloadRequest request, CancellationToken cancellationToken)
        {
            await gameServerService.Reload();

            return true;
        }

        public Task<JsonWebToken> Handle(JWTRequest request, CancellationToken cancellationToken)
        => gameServerService.GetJWT(request);

        public Task<OnlineUsers> Handle(OnlineUserRequest request, CancellationToken cancellationToken)
        => string.IsNullOrWhiteSpace(request.Game)
                ? gameServerService.GetOnlineUsers()
                : gameServerService.GetOnlineUsers(Enumeration.FromValue<GameType>(request.Game));

        public Task<bool> Handle(UnderMaintenanceRequest request, CancellationToken cancellationToken)
            => gameServerService.UnderMaintenance(new UM.Requests.UMRequest(request.IsUM, request.StartTime, request.EndTime));
    }
}
