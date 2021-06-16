using System.Collections.Generic;
using GamesAdmin.Core.Models;
using MediatR;

namespace GamesAdmin.Api.GameSettings.Requests
{
    public class UpdateOddsRequest : IRequest<bool>
    {
        public UpdateOddsRequest(string gameName, IEnumerable<BetChoiceOdds> odds)
        {
            GameName = gameName;
            Odds = odds;
        }

        public string GameName { get; }
        public IEnumerable<BetChoiceOdds> Odds { get; }
    }
}