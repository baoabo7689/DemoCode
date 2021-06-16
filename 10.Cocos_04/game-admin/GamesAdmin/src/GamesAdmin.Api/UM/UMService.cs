using GamesAdmin.Api.GameServers;
using GamesAdmin.Api.UM.Requests;
using GamesAdmin.Database;
using GamesAdmin.Database.Entities;
using Sentry;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace GamesAdmin.Api.UM
{
    public interface IUMService
    {
        Task<bool> Process(bool isUM, DateTimeOffset startTime, DateTimeOffset endTime);
    }

    public class UMService : IUMService
    {
        private readonly ISentryClient sentryClient;
        private readonly IGenericRepository<UMInfoEntity> umRepository;
        private readonly IGenericRepository<GameConfigEntity> configRepository;
        private readonly IGameServerService gameServerService;

        public UMService(
            ISentryClient sentryClient,
            IGenericRepository<UMInfoEntity> umRepository,
            IGenericRepository<GameConfigEntity> configRepository,
            IGameServerService gameServerService)
        {
            this.sentryClient = sentryClient;
            this.umRepository = umRepository;
            this.configRepository = configRepository;
            this.gameServerService = gameServerService;
        }

        public Task<bool> Process(bool isUM, DateTimeOffset startTime, DateTimeOffset endTime) => isUM ? Start(startTime, endTime) : End();

        public async Task<bool> Start(DateTimeOffset startTime, DateTimeOffset endTime)
        {
            try
            {
                sentryClient.CaptureMessage($"UM Start: {startTime} End: {endTime}");

                await UpdateEnableConfig(false);

                var umInfo = umRepository.FilterBy(um => !um.Finish).FirstOrDefault();
                var umInfoEntity = new UMInfoEntity
                {
                    Start = startTime == default ? default : startTime.ToUniversalTime().UtcDateTime,
                    End = endTime == default ? default : endTime.ToUniversalTime().UtcDateTime,
                    Time = DateTime.UtcNow
                };
                await SendUmInfomationToGameServer(true, umInfoEntity.Start, umInfoEntity.End);

                if (umInfo == null)
                {
                    umInfoEntity.Finish = false;
                    await umRepository.InsertOneAsync(umInfoEntity);
                }

                return true;
            }
            catch (Exception ex)
            {
                sentryClient.CaptureException(ex);

                return false;
            }
        }

        public async Task<bool> End()
        {
            try
            {
                await UpdateEnableConfig(true);

                sentryClient.CaptureMessage($"UM Finished");

                var umInfo = umRepository.FilterBy(um => !um.Finish).FirstOrDefault();

                if (umInfo != null)
                {
                    umInfo.Finish = true;

                    await umRepository.ReplaceOneAsync(umInfo);
                    await this.SendUmInfomationToGameServer(false, DateTime.MinValue, DateTime.MinValue);
                }

                return true;
            }
            catch (Exception ex)
            {
                sentryClient.CaptureException(ex);

                return false;
            }
        }

        private async Task SendUmInfomationToGameServer(bool isUm, DateTime start, DateTime end)
        {
            var umRequest = new UMRequest(isUm, start, end);

            await this.gameServerService.UnderMaintenance(umRequest);
        }

        private async Task UpdateEnableConfig(bool enable)
        {
            var configs = configRepository.AsQueryable().ToList();

            foreach (var game in configs)
            {
                game.Enabled = enable;

                await configRepository.ReplaceOneAsync(game);
            }
        }
    }
}
