using GamesAdmin.Core.Models.Announcement;
using GamesAdmin.Site.Features.Announcement.ViewModels;
using MediatR;

namespace GamesAdmin.Site.Features.Announcement.Requests
{
    public class EditRequest : IRequest<bool>
    {
        public EditRequest(EditViewModel model)
        {
            Model = model.Data;
        }

        public AnnouncementModel Model { get; }
    }
}
