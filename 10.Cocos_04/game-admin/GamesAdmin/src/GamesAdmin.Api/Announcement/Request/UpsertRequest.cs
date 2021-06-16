using GamesAdmin.Core.Models.Announcement;
using MediatR;

namespace GamesAdmin.Api.Announcement.Request
{
    public class UpsertRequest : IRequest<bool>
    {
        public UpsertRequest(AnnouncementModel model)
        {
            this.Model = model;
        }

        public AnnouncementModel Model { get; set; }
    }
}
