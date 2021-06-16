using GamesAdmin.Core.Models;
using MediatR;

namespace GamesAdmin.Api.GameMarket.Requests
{
    public class GetByNameRequest : IRequest<GameSettingModel>
    {
        public GetByNameRequest(string name)
        {
            Name = name;
        }

        public string Name { get; }
    }
}
