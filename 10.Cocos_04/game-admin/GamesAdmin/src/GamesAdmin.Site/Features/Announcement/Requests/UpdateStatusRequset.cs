using MediatR;

namespace GamesAdmin.Site.Features.Announcement.Requests
{
    public class UpdateStatusRequest : IRequest<bool>
    {
        public UpdateStatusRequest()
        {
            Id = string.Empty;
            Status = false;
        }

        public UpdateStatusRequest(string id, bool status)
        {
            Id = id;
            Status = status;
        }

        public string Id { get; set; }
        public bool Status { get; set; }
    }
}