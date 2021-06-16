using GamesAdmin.Core.Models.Chip;
using GamesAdmin.Site.Features.ChipConfig.ViewModels;
using MediatR;

namespace GamesAdmin.Site.Features.ChipConfig.Requests
{
    public class EditRequest : IRequest<bool>
    {
        public EditRequest(EditViewModel model)
        {
            Model = model.Data;
        }

        public ChipModel Model { get; }
    }
}
