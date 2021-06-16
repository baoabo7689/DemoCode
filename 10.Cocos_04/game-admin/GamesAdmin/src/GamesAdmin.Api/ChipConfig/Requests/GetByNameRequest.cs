using GamesAdmin.Core.Models.Chip;
using MediatR;

namespace GamesAdmin.Api.ChipConfig.Requests
{
    public class GetByNameRequest : IRequest<ChipModel>
    {
        public GetByNameRequest(string name)
        {
            this.Name = name;
        }

        public string Name { get; set; }
    }
}
