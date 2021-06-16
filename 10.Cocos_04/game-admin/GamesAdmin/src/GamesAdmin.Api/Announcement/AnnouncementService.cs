using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using GamesAdmin.Api.Announcement.Request;
using GamesAdmin.Core.Models.Announcement;
using GamesAdmin.Database;
using GamesAdmin.Database.Entities.Announcement;
using MongoDB.Bson;
using MongoDB.Driver;
using Sentry;

namespace GamesAdmin.Api.Announcement
{
    public interface IAnnouncementService
    {
        Task<bool> Upsert(AnnouncementModel model);
        Task<AnnouncementModel> GetById(string id);
        Task<IEnumerable<AnnouncementModel>> GetAll(GetAllRequest request);

        Task<bool> UpdateStatus(UpdateStatusRequest request);
    }

    public class AnnouncementService : IAnnouncementService
    {
        private readonly ISentryClient sentryClient;
        private readonly IMapper mapper;
        private readonly IGenericRepository<AnnouncementEntity> repository;

        public AnnouncementService(IGenericRepository<AnnouncementEntity> repository, ISentryClient sentryClient, IMapper mapper)
        {
            this.repository = repository;
            this.sentryClient = sentryClient;
            this.mapper = mapper;
        }

        public async Task<IEnumerable<AnnouncementModel>> GetAll(GetAllRequest request)
        {
            try
            {
                var entities = await repository.FilterByAsync(entity =>
                (request.MessageType == null || entity.MessageType == request.MessageType)
                && (request.Status == null || entity.Status == request.Status)
                && (request.Market == null || entity.EnabledMarkets.Contains(request.Market)));

                return entities.Select(entity => mapper.Map<AnnouncementModel>(entity));
            }
            catch (Exception ex)
            {
                sentryClient.CaptureException(ex);
                return null;
            }
        }

        public async Task<bool> Upsert(AnnouncementModel model)
        {
            try
            {
                var result = false;

                if(model.Title != null || model.Contents != null)
                {
                    var existingEntity = model.Id != null ? await repository.FindOneAsync(x => x.Id == ObjectId.Parse(model.Id)) : null;
                    var newEntity = new AnnouncementEntity
                    {
                        Title = model.Title,
                        Contents = model.Contents,
                        MessageType = model.MessageType,
                        EnabledMarkets = model.EnabledMarkets,
                        Status = model.Status
                    };

                    if (existingEntity != null)
                    {
                        newEntity.Id = existingEntity.Id;
                        await repository.ReplaceOneAsync(newEntity);
                    }
                    else
                    {
                        await repository.InsertOneAsync(newEntity);
                    }

                    result = true;
                }


                return result;
            }
            catch (Exception ex)
            {
                sentryClient.CaptureException(ex);
                return false;
            }
        }

        public async Task<AnnouncementModel> GetById(string id)
        {
            try
            {
                var entity = await repository.FindOneAsync(x => x.Id == ObjectId.Parse(id));

                return mapper.Map<AnnouncementModel>(entity);
            }
            catch (Exception e)
            {
                sentryClient.CaptureException(e);
                return null;
            }
        }

        public async Task<bool> UpdateStatus(UpdateStatusRequest request)
        {
            try
            {
                if (request.Id != null)
                {
                    var update = Builders<AnnouncementEntity>.Update.Set(nameof(AnnouncementEntity.Status), request.Status);
                    await repository.UpdateAsync(entity => entity.Id == ObjectId.Parse(request.Id), update);
                }
                else
                {
                    return false;
                }

                return true;
            }
            catch (Exception ex)
            {
                sentryClient.CaptureException(ex);
                return false;
            }
        }
    }
}