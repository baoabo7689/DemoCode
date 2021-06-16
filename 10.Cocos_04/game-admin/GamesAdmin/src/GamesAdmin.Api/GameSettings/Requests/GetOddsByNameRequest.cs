using System.Collections.Generic;
using GamesAdmin.Core.Models;
using MediatR;

namespace GamesAdmin.Api.GameSettings.Requests
{
    public class GetOddsByNameRequest : IRequest<IEnumerable<BetChoiceOdds>>
    {
        public GetOddsByNameRequest(string name)
        {
            Name = name;
        }

        public string Name { get; }
    }
}
