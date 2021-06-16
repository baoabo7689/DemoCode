using MediatR;

namespace GamesAdmin.Api.Announcement.Request
{
    public class UpdateStatusRequest : IRequest<bool>
    {
        public UpdateStatusRequest(string id, bool status)
        {
            this.Id = id;
            this.Status = status;
        }

        public string Id { get; }
        public bool Status { get; }
    }
}