using System.Collections.Generic;
using GamesAdmin.Core.Models;
using GamesAdmin.Site.Features.GameSettings.ViewModels;
using MediatR;

namespace GamesAdmin.Site.Features.GameSettings.Requests
{
    public class GetOddsRequest : IRequest<EditOddsViewModel>
    {
        public GetOddsRequest(string gameName)
        {
            GameName = gameName;
        }

        public string GameName { get; set; }
    }
}