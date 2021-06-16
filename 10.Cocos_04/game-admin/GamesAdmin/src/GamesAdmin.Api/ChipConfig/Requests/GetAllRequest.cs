using GamesAdmin.Core.Models.Chip;
using MediatR;
using System.Collections.Generic;

namespace GamesAdmin.Api.ChipConfig.Requests
{
    public class GetAllRequest : IRequest<IEnumerable<ChipModel>>
    {
    }
}
