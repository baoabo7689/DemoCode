using GamesAdmin.Core.Models.Chip;
using MediatR;

namespace GamesAdmin.Api.ChipConfig.Requests
{
    public class UpsertRequest : IRequest<bool>
    {
        public UpsertRequest(ChipModel model)
        {
            this.Model = model;
        }

        public ChipModel Model { get; set; }
    }
}
