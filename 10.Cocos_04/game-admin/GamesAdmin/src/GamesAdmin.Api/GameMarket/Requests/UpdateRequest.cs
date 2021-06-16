using GamesAdmin.Core.Models;
using MediatR;

namespace GamesAdmin.Api.GameMarket.Requests
{
    public class UpdateRequest : IRequest<bool>
    {
        public UpdateRequest(GameSettingModel gameSetting)
        {
            GameSetting = gameSetting;
        }

        public GameSettingModel GameSetting { get; }
    }
}
