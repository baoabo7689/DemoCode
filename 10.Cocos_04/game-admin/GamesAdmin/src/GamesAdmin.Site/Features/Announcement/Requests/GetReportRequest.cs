using GamesAdmin.Site.Features.Announcement.ViewModels;
using MediatR;

namespace GamesAdmin.Site.Features.Announcement.Requests
{
    public class GetReportRequest : IRequest<ReportResultViewModel>
    {
        public string MessageType { get; set; }

        public string Market { get; set; }

        public string Status { get; set; }
    }
}
