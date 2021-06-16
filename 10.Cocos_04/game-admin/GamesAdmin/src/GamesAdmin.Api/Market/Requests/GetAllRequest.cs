using MediatR;
using System.Collections.Generic;

namespace GamesAdmin.Api.Market.Requests
{
    public class GetAllRequest : IRequest<IEnumerable<Core.Models.Market>>
    {
    }
}
