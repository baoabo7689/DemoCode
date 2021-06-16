using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using GamesAdmin.Api.Announcement.Request;
using GamesAdmin.Core.Models.Announcement;
using MediatR;

namespace GamesAdmin.Api.Announcement
{
    public class AnnouncementHandler :
        IRequestHandler<UpsertRequest, bool>,
        IRequestHandler<GetAllRequest, IEnumerable<AnnouncementModel>>,
        IRequestHandler<GetByIdRequest, AnnouncementModel>,
        IRequestHandler<UpdateStatusRequest, bool>

    {
        private readonly IAnnouncementService service;

        public AnnouncementHandler(IAnnouncementService service)
        {
            this.service = service;
        }

        public async Task<bool> Handle(UpsertRequest request, CancellationToken cancellationToken)
        {
            return await service.Upsert(request.Model);
        }

        public async Task<AnnouncementModel> Handle(GetByIdRequest request, CancellationToken cancellationToken)
        {
            return await service.GetById(request.Id);
        }

        public async Task<IEnumerable<AnnouncementModel>> Handle(GetAllRequest request, CancellationToken cancellationToken)
        {
            return await service.GetAll(request);
        }

        public async Task<bool> Handle(UpdateStatusRequest request, CancellationToken cancellationToken)
        {
            return await service.UpdateStatus(request);
        }
    }
}