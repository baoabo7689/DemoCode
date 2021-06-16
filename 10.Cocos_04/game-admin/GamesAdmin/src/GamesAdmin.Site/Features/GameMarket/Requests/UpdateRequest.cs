using GamesAdmin.Site.Features.GameMarket.ViewModels;
using MediatR;

namespace GamesAdmin.Site.Features.GameMarket.Requests
{
    public class UpdateRequest : IRequest<bool>
    {
        public UpdateRequest(EditViewModel gameSetting)
        {
            GameSetting = gameSetting;
        }

        public EditViewModel GameSetting { get; set; }
    }
}