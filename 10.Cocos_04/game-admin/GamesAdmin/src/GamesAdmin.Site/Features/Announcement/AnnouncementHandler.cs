using GamesAdmin.Site.Features.Announcement.Requests;
using GamesAdmin.Site.Features.Announcement.ViewModels;
using MediatR;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace GamesAdmin.Site.Features.Announcement
{
    public class AnnouncementHandler
        : IRequestHandler<GetReportRequest, ReportResultViewModel>,
        IRequestHandler<UpdateStatusRequest, bool>,
        IRequestHandler<GetEditRequest, EditViewModel>,
        IRequestHandler<EditRequest, bool>
    {
        private readonly IAnnouncementService service;

        public AnnouncementHandler(IAnnouncementService service)
        {
            this.service = service;
        }

        public async Task<ReportResultViewModel> Handle(GetReportRequest request, CancellationToken cancellationToken)
        {
            var result = await service.GetReport(request);
            return new ReportResultViewModel
            {
                Records = result.Select(i => new RecordViewModel {
                    Title = i.Title,
                    Contents = i.Contents,
                    MessageType = i.MessageType,
                    EnabledMarkets = i.EnabledMarkets,
                    Status = i.Status,
                    Id = i.Id
                })
            };
        }

        public async Task<EditViewModel> Handle(GetEditRequest request, CancellationToken cancellationToken)
        {
            var result = await service.Get(request);
            return new EditViewModel
            {
                Data = result
            };
        }

        public async Task<bool> Handle(EditRequest request, CancellationToken cancellationToken)
        {
            return await service.Edit(request);
        }

        public async Task<bool> Handle(UpdateStatusRequest request, CancellationToken cancellationToken)
        {
            return await service.UpdateStatus(request);
        }
    }
}
