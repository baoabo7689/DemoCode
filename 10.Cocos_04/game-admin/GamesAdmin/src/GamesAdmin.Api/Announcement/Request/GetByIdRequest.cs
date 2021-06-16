using GamesAdmin.Core.Models.Announcement;
using MediatR;

namespace GamesAdmin.Api.Announcement.Request
{
    public class GetByIdRequest : IRequest<AnnouncementModel>
    {
        public GetByIdRequest(string id)
        {
            this.Id = id;
        }

        public string Id { get; set; }
    }
}